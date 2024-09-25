import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ unique: true, length: 10 })
  number: string;

  @Column({ length: 128 })
  fullName: string;

  @Column({ unique: true, length: 64 })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @CreateDateColumn()
  createdAt: Date;
}
