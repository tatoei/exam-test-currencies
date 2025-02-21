import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Order } from './order.entity';

@Entity('cryptocurrencies')
export class Cryptocurrency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 18, scale: 8 })
  network_fee: number;

  @Column()
  blockchain_network: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => Wallet, wallet => wallet.cryptocurrency)
  wallets: Wallet[];

  @OneToMany(() => Order, order => order.from_currency)
  orders_from: Order[];

  @OneToMany(() => Order, order => order.to_currency)
  orders_to: Order[];
}