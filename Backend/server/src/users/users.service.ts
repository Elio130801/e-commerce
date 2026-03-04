import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roles', 'fullName'], 
    });
  }

  // 👇 NUEVO: Busca a un usuario usando el token temporal
  async findByResetToken(token: string) {
    return this.userRepository.findOne({
      where: { resetPasswordToken: token }
    });
  }

  // 👇 NUEVO: Guarda a un usuario que ya existe (actualiza sus datos)
  async save(user: User) {
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'fullName', 'roles'] 
    });
  }

  async update(id: string, updateData: Record<string, any>) {
    // Si desde el frontend nos envían una contraseña nueva, la encriptamos
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Actualizamos el usuario en la base de datos
    await this.userRepository.update(id, updateData);

    // Devolvemos el usuario actualizado para confirmar
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'fullName', 'roles'] 
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}