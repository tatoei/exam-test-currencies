import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Cryptocurrency } from './cryptocurrency.entity';
import { FiatCurrency } from './fiat-currency.entity';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.wallets)
  user: User;

  @ManyToOne(() => Cryptocurrency, (crypto) => crypto.wallets, { nullable: true })
  cryptocurrency: Cryptocurrency;
  
  @ManyToOne(() => FiatCurrency, (fiat) => fiat.wallets, { nullable: true })
  fiat_currency: FiatCurrency;

  @Column()
  address: string;

  @Column('decimal', { precision: 18, scale: 8 })
  balance: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Transaction, transaction => transaction.from_wallet)
  outgoing_transactions: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.to_wallet)
  incoming_transactions: Transaction[];
}