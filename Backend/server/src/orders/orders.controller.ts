import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() request: any, @Body() createOrderDto: CreateOrderDto) {
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        createOrderDto.userId = payload.sub; 
        
        console.log("🛒 Compra registrada para el usuario ID:", payload.sub);
      } catch (error) {
        console.log("⚠️ Error leyendo el token o compra anónima procesada");
      }
    }

    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  findMyOrders(@Req() request: any) {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return []; // Si no hay token, no devolvemos nada
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      return this.ordersService.findMyOrders(payload.sub);
    } catch (error) {
      return [];
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
