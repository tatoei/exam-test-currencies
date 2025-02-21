import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Wallet } from './wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.transactions)
  order: Order;

  @ManyToOne(() => Wallet, wallet => wallet.outgoing_transactions)
  from_wallet: Wallet;
  
  @ManyToOne(() => Wallet, wallet => wallet.incoming_transactions)
  to_wallet: Wallet;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @Column()
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'trade';

  @Column()
  status: 'pending' | 'completed' | 'failed';

  @Column({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}