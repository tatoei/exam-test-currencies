import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/modules/user/user.decorator';


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@User() userId: number, @Body() orderData: CreateOrderDto) {
    return this.orderService.createOrder(userId, orderData);
  }

  @Get()
  async getUserOrders(@User() userId: number) {
    return this.orderService.getUserOrders(userId);
  }

  @Delete(':id')
  async cancelOrder(@Param('id') orderId: number, @User() userId: number) {
    return this.orderService.cancelOrder(orderId, userId);
  }
}