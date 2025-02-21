import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(['buy', 'sell'])
  type: 'buy' | 'sell';

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  fromCurrencyId: number;

  @IsNotEmpty()
  toCurrencyId: number;
}