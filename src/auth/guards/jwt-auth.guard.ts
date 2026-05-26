import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Guard para proteger rutas utilizando JWT
export class JwtAuthGuard extends AuthGuard('jwt') {}
