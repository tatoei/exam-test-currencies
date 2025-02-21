import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entitys/transaction.entity';
import { Repository } from 'typeorm';
import { WalletService } from '../wallet/wallet.service';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private walletService: WalletService
  ) {}

  async processTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      // ลดยอดเงินจากกระเป๋าต้นทาง
      await this.walletService.updateWalletBalance(
        transaction.from_wallet.id,
        -transaction.amount
      );

      // เพิ่มยอดเงินในกระเป๋าปลายทาง
      await this.walletService.updateWalletBalance(
        transaction.to_wallet.id,
        transaction.amount
      );

      transaction.status = 'completed';
      return this.transactionRepository.save(transaction);
    } catch (error) {
      transaction.status = 'failed';
      await this.transactionRepository.save(transaction);
      throw error;
    }
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [
        { from_wallet: { user: { id: userId } } },
        { to_wallet: { user: { id: userId } } }
      ],
      relations: ['from_wallet', 'to_wallet', 'order']
    });
  }
}
