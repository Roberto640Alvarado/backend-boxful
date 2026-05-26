import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Sexo } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEnum(Sexo)
  sexo!: Sexo;

  @IsDateString()
  fechaNacimiento!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
