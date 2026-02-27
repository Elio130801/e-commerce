import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'; // 👈 Sumamos Payment
import { OrdersService } from '../orders/orders.service'; // 👈 Importamos tu servicio

@Injectable()
export class PaymentsService {
    private client: MercadoPagoConfig;

    // 👇 Inyectamos el servicio de Órdenes aquí
    constructor(private readonly ordersService: OrdersService) {
        this.client = new MercadoPagoConfig({
            accessToken: 'APP_USR-5964032104873617-022712-67e2f09172420f1e5650244aacbd648d-3230985907', // 🚨 Pon tu Token
        });
    }

    async createPayment(orderData: any) {
        try {
            // 1. ANTES DE NADA: Guardamos la orden en Postgres como "PENDING"
            const newOrder = await this.ordersService.create({
                customerName: orderData.customerName,
                customerEmail: orderData.customerEmail,
                total: orderData.total,
                items: orderData.items,
                status: 'PENDING'
            });

            // 2. Mapeamos productos para Mercado Pago
            const items = orderData.items.map((item: any) => ({
                id: item.id,
                title: item.name,
                description: item.description || 'Producto',
                unit_price: Number(item.price),
                quantity: Number(item.quantity),
                currency_id: 'ARS',
            }));

            const preference = new Preference(this.client);
            const result = await preference.create({
                body: {
                    items: items,
                    external_reference: newOrder.id,
                    back_urls: {
                        success: 'http://localhost:3000/success',
                        failure: 'http://localhost:3000/failure',
                        pending: 'http://localhost:3000/pending',
                    },
                }
            });

            return { url: result.sandbox_init_point }; 
        } catch (error) {
            console.error('Error al crear pago:', error);
            throw new Error('Error al generar el link');
        }
    }

    // 👇 NUEVO: Esta función se activa cuando Mercado Pago nos llama
    async handleWebhook(paymentId: string) {
        try {
            // 1. Buscamos el detalle de este pago en Mercado Pago
            const payment = new Payment(this.client);
            const paymentInfo = await payment.get({ id: paymentId });

            // 2. Verificamos si se aprobó
            if (paymentInfo.status === 'approved') {
                const orderId = paymentInfo.external_reference; // Recuperamos tu ID de orden
                if (orderId) {
                    // 3. ¡Magia! Actualizamos Postgres a "PAID"
                    await this.ordersService.updateStatus(orderId, 'PAID');
                    console.log(`✅ ¡ÉXITO! Orden ${orderId} pagada y actualizada en la Base de Datos.`);
                }
            }
        } catch (error) {
            console.error('Error en Webhook:', error);
        }
    }
}