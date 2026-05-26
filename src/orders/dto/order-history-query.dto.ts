import { IsDateString, IsOptional, ValidateIf } from 'class-validator';

export class OrderHistoryQueryDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaInicio debe ser una fecha válida con formato YYYY-MM-DD' },
  )
  fechaInicio?: string;

  @ValidateIf((o: OrderHistoryQueryDto) => o.fechaInicio !== undefined)
  @IsDateString(
    {},
    { message: 'fechaFin debe ser una fecha válida con formato YYYY-MM-DD' },
  )
  fechaFin?: string;
}
