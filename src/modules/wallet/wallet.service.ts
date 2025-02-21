import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/entitys/wallet.entity';
import { Repository } from 'typeorm';


@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async getUserWallets(userId: number): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { user: { id: userId } },
      relations: ['cryptocurrency', 'fiat_currency']
    });
  }

  async updateWalletBalance(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balance += amount;
    if (wallet.balance < 0) {
      throw new Error('Insufficient balance');
    }

    return this.walletRepository.save(wallet);
  }
}