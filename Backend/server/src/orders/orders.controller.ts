import { Controller, Get, Post, Body, Param, Delete, Patch, Headers, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // 👇 1️⃣ NUEVA RUTA: Mis Pedidos (¡Siempre arriba del :id!)
  @Get('my-orders')
  async findMyOrders(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No has iniciado sesión');
    }
    
    try {
      // 1. Extraemos el email del cliente leyendo su Token
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userEmail = payload.email;

      // 2. Buscamos todas las órdenes y filtramos solo las de este cliente
      const allOrders = await this.ordersService.findAll();
      return allOrders.filter((order: any) => order.customerEmail === userEmail);
      
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  // 👇 2️⃣ RUTA DINÁMICA: Buscar por ID (Va abajo para no pisar a my-orders)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}