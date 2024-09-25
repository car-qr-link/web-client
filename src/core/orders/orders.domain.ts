import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewOrderDto {
  @IsNotEmpty({ message: 'Укажите, пожалуйста, имя' })
  fullName: string;

  @IsEmail({}, { message: 'Проверьте пожалуйста, адрес электронной почты' })
  email: string;

  @IsNotEmpty({ message: 'Укажите, пожалуйста, адрес для доставки' })
  address: string;
}

export class OrderDto extends NewOrderDto {
  id: number;
  number: string;
  createdAt: Date;
}
