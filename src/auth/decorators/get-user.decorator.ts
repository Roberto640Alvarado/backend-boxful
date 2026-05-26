import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Decorator que extrae el usuario autenticado del request
// Uso con campo específico: @GetUser('id') userId: string
export const GetUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser;

    return data ? user?.[data] : user;
  },
);

export interface AuthenticatedUser {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}
