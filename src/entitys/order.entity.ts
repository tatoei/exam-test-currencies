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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  type: 'buy' | 'sell';

  @Column()
  status: 'pending' | 'partial' | 'completed' | 'cancelled';

  @ManyToOne(() => Cryptocurrency, (crypto) => crypto.orders_from, {
    nullable: true,
  })
  from_cryptocurrency: Cryptocurrency;

  @ManyToOne(() => FiatCurrency, (fiat) => fiat.orders_from, { nullable: true })
  from_fiat: FiatCurrency;

  @ManyToOne(() => Cryptocurrency, (crypto) => crypto.orders_to, {
    nullable: true,
  })
  to_cryptocurrency: Cryptocurrency;

  @ManyToOne(() => FiatCurrency, (fiat) => fiat.orders_to, { nullable: true })
  to_fiat: FiatCurrency;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];
  from_currency: FiatCurrency | Cryptocurrency;
  to_currency: FiatCurrency | Cryptocurrency;
}
