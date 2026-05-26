import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePackageDto {
  @IsNumber({}, { message: 'El largo debe ser un número' })
  @IsPositive({ message: 'El largo debe ser mayor a 0' })
  largo!: number;

  @IsNumber({}, { message: 'El alto debe ser un número' })
  @IsPositive({ message: 'El alto debe ser mayor a 0' })
  alto!: number;

  @IsNumber({}, { message: 'El ancho debe ser un número' })
  @IsPositive({ message: 'El ancho debe ser mayor a 0' })
  ancho!: number;

  @IsNumber({}, { message: 'El peso debe ser un número' })
  @IsPositive({ message: 'El peso debe ser mayor a 0' })
  peso!: number;

  @IsString({ message: 'El contenido debe ser texto' })
  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  @MaxLength(100, { message: 'El contenido no puede exceder 100 caracteres' })
  contenido!: string;
}
