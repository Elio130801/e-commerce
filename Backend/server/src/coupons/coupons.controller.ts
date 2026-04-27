import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) {}

    // Ruta para el panel Admin (Crear cupón)
    @Post()
    create(@Body() createCouponDto: any) {
        return this.couponsService.create(createCouponDto);
    }

    // Ruta para el panel Admin (Listar cupones)
    @Get()
    findAll() {
        return this.couponsService.findAll();
    }

    // Ruta pública para el cliente (Aplicar cupón en el carrito)
    @Get('validate/:code')
    validate(@Param('code') code: string) {
        return this.couponsService.validate(code);
    }

    // Ruta para el panel Admin (Eliminar cupón)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.couponsService.remove(id);
    }
}