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
      select: ['id', 'email', 'password', 'roles'], 
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