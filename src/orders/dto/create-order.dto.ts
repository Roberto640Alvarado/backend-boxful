import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreatePackageDto } from './create-package.dto';

export class CreateOrderDto {
  @IsString({ message: 'La dirección de recolección debe ser texto' })
  @IsNotEmpty({ message: 'La dirección de recolección es obligatoria' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccionRecoleccion!: string;

  @IsDateString(
    {},
    { message: 'La fecha programada debe ser una fecha válida' },
  )
  fechaProgramada!: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del destinatario es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombres!: string;

  @IsString({ message: 'El apellido debe ser texto' })
  @IsNotEmpty({ message: 'El apellido del destinatario es obligatorio' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  apellidos!: string;

  @IsEmail({}, { message: 'El correo del destinatario debe ser válido' })
  correo!: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  @IsNotEmpty({ message: 'El teléfono del destinatario es obligatorio' })
  @MaxLength(13, { message: 'El teléfono no puede exceder 13 caracteres' })
  telefono!: string;

  @IsString({ message: 'La dirección del destinatario debe ser texto' })
  @IsNotEmpty({ message: 'La dirección del destinatario es obligatoria' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccionDestinatario!: string;

  @IsString({ message: 'El departamento debe ser texto' })
  @IsNotEmpty({ message: 'El departamento es obligatorio' })
  @MaxLength(100, {
    message: 'El departamento no puede exceder 100 caracteres',
  })
  departamento!: string;

  @IsString({ message: 'El municipio debe ser texto' })
  @IsNotEmpty({ message: 'El municipio es obligatorio' })
  @MaxLength(100, { message: 'El municipio no puede exceder 100 caracteres' })
  municipio!: string;

  @IsString({ message: 'El punto de referencia debe ser texto' })
  @IsNotEmpty({ message: 'El punto de referencia es obligatorio' })
  @MaxLength(255, {
    message: 'El punto de referencia no puede exceder 255 caracteres',
  })
  puntoReferencia!: string;

  @IsString({ message: 'Las indicaciones deben ser texto' })
  @IsNotEmpty({ message: 'Las indicaciones son obligatorias' })
  @MaxLength(500, {
    message: 'Las indicaciones no pueden exceder 500 caracteres',
  })
  indicaciones!: string;

  @IsArray({ message: 'Los paquetes deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un paquete' })
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDto)
  paquetes!: CreatePackageDto[];
}
