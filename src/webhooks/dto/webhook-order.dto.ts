import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class WebhookOrderDto {
  @IsNumber({}, { message: 'El monto recolectado debe ser un número' })
  @IsPositive({ message: 'El monto recolectado debe ser mayor a 0' })
  @IsOptional()
  collectedAmount?: number;
}
