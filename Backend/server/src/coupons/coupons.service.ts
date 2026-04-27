import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private readonly couponRepository: Repository<Coupon>,
    ) {}

    async create(createCouponDto: any) {
        // Aseguramos que el código siempre se guarde en mayúsculas
        const newCoupon = this.couponRepository.create({
            ...createCouponDto,
            code: createCouponDto.code.toUpperCase(),
        });
        return await this.couponRepository.save(newCoupon);
    }

    async findAll() {
        return await this.couponRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    async validate(code: string) {
        const coupon = await this.couponRepository.findOne({ 
            where: { code: code.toUpperCase() } 
        });
        
        if (!coupon) {
            throw new NotFoundException('El cupón ingresado no existe');
        }
        if (!coupon.isActive) {
            throw new BadRequestException('Este cupón ya no es válido o ha expirado');
        }

        return coupon;
    }

    async remove(id: string) {
        return await this.couponRepository.delete(id);
    }
}