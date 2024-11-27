import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async setResetPasswordToken(email: string, token: string, expires: Date) {
    const user = await this.findOneByEmail(email);
    if (user) {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      return this.userRepository.save(user);
    }
    return null;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, token } = resetPasswordDto;
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.findOneByEmail(decoded.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.resetPasswordToken !== token) {
        throw new ForbiddenException('Invalid reset token');
      }
      if (user.resetPasswordExpires < new Date()) {
        throw new BadRequestException('Reset token has expired');
      }
      user.password = bcrypt.hashSync(newPassword, 10);
      return this.userRepository.save(user);
    } catch (error) {
      return null;
    }
  }

}
