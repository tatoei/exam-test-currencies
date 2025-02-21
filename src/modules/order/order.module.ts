import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entitys/order.entity';
import { Wallet } from 'src/entitys/wallet.entity';
import { Transaction } from 'src/entitys/transaction.entity';


@Module({
	imports: [TypeOrmModule.forFeature([Order, Wallet, Transaction])],
	providers: [OrderService],
	controllers: [OrderController],
	exports: [OrderService]
  })
  export class OrderModule {}