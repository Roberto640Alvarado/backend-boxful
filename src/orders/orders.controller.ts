import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderHistoryQueryDto } from './dto/order-history-query.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Todas las rutas de este controlador requieren JWT
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Crea una nueva orden con sus paquetes
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@GetUser() user: AuthenticatedUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  // Devuelve el historial de órdenes del usuario autenticado
  @Get('history')
  getOrderHistory(
    @GetUser() user: AuthenticatedUser,
    @Query() query: OrderHistoryQueryDto,
  ) {
    return this.ordersService.getOrderHistory(user.id, query);
  }

  // Devuelve el balance acumulado de liquidacion del usuario autenticado
  @Get('balance')
  getBalance(@GetUser() user: AuthenticatedUser) {
    return this.ordersService.getBalance(user.id);
  }
}
