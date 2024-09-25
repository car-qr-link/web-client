import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import { Repository } from 'typeorm';
import { NewOrderDto, OrderDto } from './orders.domain';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}

  async create(order: NewOrderDto): Promise<OrderDto> {
    await validateOrReject(order);

    if (await this.orders.existsBy({ email: order.email })) {
      throw new ConflictException(`Ваш заказ уже в обработке.`);
    }

    const newOrder = this.orders.create({
      ...order,
      number: (process.hrtime.bigint() % 10_000_000_000n).toString(),
    });

    return await this.orders.save(newOrder);
  }
}
