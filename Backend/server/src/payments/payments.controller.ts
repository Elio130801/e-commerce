import { Body, Controller, Post, Query, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('create')
    createPayment(@Body() body: any) {
        return this.paymentsService.createPayment(body);
    }

    // 👇 LA RUTA SECRETA DEL CHISMOSO (WEBHOOK)
    @Post('webhook')
    @HttpCode(200) // Obligatorio: Responder "Ok" rápido a Mercado Pago
    async receiveWebhook(@Query() query: any, @Body() body: any) {
        // Mercado Pago nos manda el ID de la operación por acá
        const paymentId = query['data.id'] || (body.data && body.data.id);
        
        if (paymentId) {
            // Le decimos al servicio que revise este pago
            this.paymentsService.handleWebhook(paymentId);
        }
        
        return 'OK'; 
    }
}