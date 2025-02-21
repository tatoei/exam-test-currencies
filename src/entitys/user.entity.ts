import { Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Order } from './order.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  verify_status: string;

  @Column({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
