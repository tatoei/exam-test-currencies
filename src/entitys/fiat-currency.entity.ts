import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Order } from './order.entity';

@Entity('fiat_currencies')
export class FiatCurrency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Wallet, wallet => wallet.fiat_currency)
  wallets: Wallet[];

  @OneToMany(() => Order, order => order.from_cryptocurrency)
  orders_from: Order[];
  
  @OneToMany(() => Order, order => order.to_cryptocurrency)
  orders_to: Order[];
}