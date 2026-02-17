import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  
  // 1. INYECCIÓN DE DEPENDENCIAS
  // Aquí le pedimos a NestJS que nos de acceso a la tabla 'User'
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 2. MÉTODO PARA CREAR USUARIO
  async create(createUserDto: CreateUserDto) {
    // A. Creamos una instancia del usuario con los datos recibidos
    const user = this.userRepository.create(createUserDto);

    // B. Lo guardamos en la base de datos
    // (El 'await' espera a que la base de datos responda)
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles'], // Forzamos traer el password para compararlo
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}