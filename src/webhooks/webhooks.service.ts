import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookOrderDto } from './dto/webhook-order.dto';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  // Calcula la comision COD: 0.01% del monto recolectado con tope de 25 USD
  private calcularComisionCOD(collectedAmount: number): number {
    const comision = collectedAmount * 0.0001;
    return Math.min(comision, 25);
  }

  // Calcula el monto a liquidar al comercio por una orden
  private calcularLiquidacion(
    isCOD: boolean,
    shippingCost: number,
    collectedAmount?: number,
  ): number {
    if (isCOD && collectedAmount) {
      const comision = this.calcularComisionCOD(collectedAmount);
      return collectedAmount - shippingCost - comision;
    }
    return -shippingCost;
  }

  // Recibe la actualizacion del webhook y calcula la liquidacion
  async updateOrder(numeroOrden: string, dto: WebhookOrderDto) {
    const orden = await this.prisma.order.findUnique({
      where: { numeroOrden: Number(numeroOrden) },
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (orden.status === 'delivered') {
      throw new BadRequestException('La orden ya fue marcada como entregada');
    }

    const shippingCost = orden.shippingCost ?? 0;
    const settlementAmount = this.calcularLiquidacion(
      orden.isCOD,
      shippingCost,
      dto.collectedAmount,
    );

    try {
      const ordenActualizada = await this.prisma.order.update({
        where: { numeroOrden: Number(numeroOrden) },
        data: {
          status: 'delivered',
          collectedAmount: dto.collectedAmount ?? null,
          settlementAmount,
        },
      });

      return {
        mensaje: 'Orden actualizada correctamente',
        orden: {
          numeroOrden: ordenActualizada.numeroOrden,
          status: ordenActualizada.status,
          isCOD: ordenActualizada.isCOD,
          collectedAmount: ordenActualizada.collectedAmount,
          shippingCost: ordenActualizada.shippingCost,
          settlementAmount: ordenActualizada.settlementAmount,
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar la orden, intente nuevamente',
      );
    }
  }
}
