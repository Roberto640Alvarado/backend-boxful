import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findFirst({
      where: { correo: dto.correo },
    });

    if (userExists) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hash de la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        fechaNacimiento: new Date(dto.fechaNacimiento),
        password: hashedPassword,
      },
    });

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        nombre: user.nombre,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { correo: dto.correo },
    });

    if (!user) {
      throw new UnauthorizedException('Este correo no está registrado');
    }

    // Verificar la contraseña utilizando bcrypt
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user.id, correo: user.correo };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      nombre: user.nombre,
    };
  }
}
