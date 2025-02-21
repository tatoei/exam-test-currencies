import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entitys/order.entity';
import { Wallet } from 'src/entitys/wallet.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Transaction } from 'src/entitys/transaction.entity';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createOrder(userId: number, orderData: CreateOrderDto): Promise<Order> {
    // Check wallet balance
    const userWallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
        cryptocurrency: {
          id:
            orderData.type === 'sell'
              ? orderData.fromCurrencyId
              : orderData.toCurrencyId,
        },
      },
    });

    if (!userWallet || userWallet.balance < orderData.amount) {
      throw new Error('Insufficient balance');
    }

    // Create order
    const order = this.orderRepository.create({
      user: { id: userId },
      type: orderData.type,
      status: 'pending',
      amount: orderData.amount,
      price: orderData.price,
      from_cryptocurrency: { id: orderData.fromCurrencyId },
      to_cryptocurrency: { id: orderData.toCurrencyId },
    });

    await this.orderRepository.save(order);

    // Try to match order
    await this.matchOrder(order);

    return order;
  }

  private async matchOrder(order: Order): Promise<void> {
    // ค้นหาคำสั่งที่ตรงกัน
    const matchingOrders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.wallets', 'wallets')
      .where('order.type = :type', { type: order.type === 'buy' ? 'sell' : 'buy' })
      .andWhere('order.status IN (:...statuses)', { statuses: ['pending', 'partial'] })
      .andWhere(
        order.type === 'buy' 
          ? 'order.price <= :price' 
          : 'order.price >= :price',
        { price: order.price }
      )
      .orderBy('order.price', order.type === 'buy' ? 'ASC' : 'DESC')
      .addOrderBy('order.created_at', 'ASC')
      .getMany();

    // ดำเนินการจับคู่แต่ละรายการ
    for (const matchingOrder of matchingOrders) {
      if (order.status === 'completed') break;

      // หากระเป๋าเงินของผู้ซื้อและผู้ขาย
      const buyerWallet = order.type === 'buy' 
        ? order.user.wallets.find(w => w.cryptocurrency?.id === order.to_cryptocurrency.id)
        : matchingOrder.user.wallets.find(w => w.cryptocurrency?.id === matchingOrder.to_cryptocurrency.id);

      const sellerWallet = order.type === 'sell'
        ? order.user.wallets.find(w => w.cryptocurrency?.id === order.from_cryptocurrency.id)
        : matchingOrder.user.wallets.find(w => w.cryptocurrency?.id === matchingOrder.from_cryptocurrency.id);

      if (!buyerWallet || !sellerWallet) continue;

      // คำนวณจำนวนที่จะทำการซื้อขาย
      const tradeAmount = Math.min(order.amount, matchingOrder.amount);

      // สร้างธุรกรรมการซื้อขาย
      const transaction = this.transactionRepository.create({
        order: order,
        from_wallet: sellerWallet,
        to_wallet: buyerWallet,
        amount: tradeAmount,
        transaction_type: 'trade',
        status: 'pending'
      });

      // อัพเดทยอดเงินในกระเป๋า
      sellerWallet.balance -= tradeAmount;
      buyerWallet.balance += tradeAmount;

      // อัพเดทสถานะคำสั่งซื้อขาย
      this.updateOrderStatus(order, tradeAmount);
      this.updateOrderStatus(matchingOrder, tradeAmount);

      // บันทึกการเปลี่ยนแปลงทั้งหมด
      await this.walletRepository.save([buyerWallet, sellerWallet]);
      await this.transactionRepository.save(transaction);
      await this.orderRepository.save([order, matchingOrder]);
    }
  }

  // อัพเดทสถานะคำสั่งซื้อขาย
  private updateOrderStatus(order: Order, executedAmount: number): void {
    const remainingAmount = order.amount - executedAmount;
    if (remainingAmount <= 0) {
      order.status = 'completed';
    } else {
      order.status = 'partial';
      order.amount = remainingAmount;
    }
  }

  // ดึงคำสั่งซื้อขายของผู้ใช้
  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: [
        'transactions', 
        'from_cryptocurrency', 
        'to_cryptocurrency',
        'from_fiat',
        'to_fiat'
      ]
    });
  }

  // ยกเลิกคำสั่งซื้อขาย
  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } }
    });

    if (!order) {
      throw new NotFoundException('ไม่พบคำสั่งซื้อขาย');
    }

    if (order.status === 'pending' || order.status === 'partial') {
      order.status = 'cancelled';
      await this.orderRepository.save(order);
    }

    return order;
  }
}
