import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhookOrderDto } from './dto/webhook-order.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  // Endpoint publico para recibir actualizacion de entrega de una orden
  @Post('orders/:numeroOrden')
  @HttpCode(HttpStatus.OK)
  updateOrder(
    @Param('numeroOrden') numeroOrden: string,
    @Body() dto: WebhookOrderDto,
  ) {
    return this.webhooksService.updateOrder(numeroOrden, dto);
  }
}
