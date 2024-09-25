import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}
}
