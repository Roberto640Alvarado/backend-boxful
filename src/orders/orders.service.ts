import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { OrderHistoryQueryDto } from './dto/order-history-query.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Crea una nueva orden con sus paquetes asociados al usuario autenticado
  // El numeroOrden se genera de forma secuencial basado en el total de ordenes existentes
  async createOrder(userId: string, dto: CreateOrderDto) {
    // Generar número de orden secuencial
    const totalOrdenes = await this.prisma.order.count();
    const numeroOrden = 1000000 + totalOrdenes + 1;

    try {
      const orden = await this.prisma.order.create({
        data: {
          numeroOrden,
          direccionRecoleccion: dto.direccionRecoleccion,
          fechaProgramada: new Date(dto.fechaProgramada),
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          correo: dto.correo,
          telefono: dto.telefono,
          direccionDestinatario: dto.direccionDestinatario,
          departamento: dto.departamento,
          municipio: dto.municipio,
          puntoReferencia: dto.puntoReferencia,
          indicaciones: dto.indicaciones,
          userId,
          paquetes: {
            create: dto.paquetes,
          },
        },
        include: {
          paquetes: true,
        },
      });

      return {
        mensaje: 'Orden creada correctamente',
        orden: {
          numeroOrden: orden.numeroOrden,
          direccionRecoleccion: orden.direccionRecoleccion,
          fechaProgramada: orden.fechaProgramada,
          nombres: orden.nombres,
          apellidos: orden.apellidos,
          correo: orden.correo,
          telefono: orden.telefono,
          direccionDestinatario: orden.direccionDestinatario,
          departamento: orden.departamento,
          municipio: orden.municipio,
          puntoReferencia: orden.puntoReferencia,
          indicaciones: orden.indicaciones,
          cantidadPaquetes: orden.paquetes.length,
          paquetes: orden.paquetes,
          creadoEn: orden.createdAt,
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'Error al crear la orden, intente nuevamente',
      );
    }
  }

  // Devuelve el historial de órdenes del usuario autenticado,
  // con filtrado opcional por rango de fechas (fechaInicio y fechaFin)
  async getOrderHistory(userId: string, query: OrderHistoryQueryDto) {
    const { fechaInicio, fechaFin } = query;

    // Validación cruzada: si se envía fechaFin, debe ser >= fechaInicio
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      throw new BadRequestException(
        'La fechaFin no puede ser anterior a fechaInicio',
      );
    }

    const ordenes = await this.prisma.order.findMany({
      where: {
        userId,
        ...(fechaInicio || fechaFin
          ? {
              createdAt: {
                ...(fechaInicio && {
                  gte: new Date(`${fechaInicio}T00:00:00.000Z`),
                }),
                ...(fechaFin && {
                  lte: new Date(`${fechaFin}T23:59:59.999Z`),
                }),
              },
            }
          : {}),
      },
      select: {
        numeroOrden: true,
        nombres: true,
        apellidos: true,
        departamento: true,
        municipio: true,
        createdAt: true,
        _count: {
          select: { paquetes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: ordenes.length,
      filtros: {
        fechaInicio: fechaInicio ?? null,
        fechaFin: fechaFin ?? null,
      },
      ordenes: ordenes.map((orden) => ({
        numeroOrden: orden.numeroOrden,
        nombres: orden.nombres,
        apellidos: orden.apellidos,
        departamento: orden.departamento,
        municipio: orden.municipio,
        cantidadPaquetes: orden._count.paquetes,
        creadoEn: orden.createdAt,
      })),
    };
  }
}
