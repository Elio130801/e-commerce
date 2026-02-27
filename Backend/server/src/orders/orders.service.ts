import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderData: any): Promise<Order> {
    const newOrder = this.orderRepository.create(createOrderData as Partial<Order>);
    return await this.orderRepository.save(newOrder);
  }

  async findAll() {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC'}
    });
  }

  async findMyOrders(userId: string) {
    return await this.orderRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.orderRepository.findOne({ where: { id } });
  }

  // 👇 Esta es la función mágica que usará nuestro Webhook
  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (order) {
      order.status = status;
      return await this.orderRepository.save(order);
    }
    return null;
  }

  remove(id: string) {
    return this.orderRepository.delete(id);
  }
}