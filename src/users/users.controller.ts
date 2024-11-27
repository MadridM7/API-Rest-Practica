import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private jwtService: JwtService,) {}

  @ApiOperation({ summary: 'Crear usuario (sin encriptacion)' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuario especifico por id' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOneById(+id);
  }

  @ApiOperation({ summary: 'Obtener usuario especifico por email' })
  @Get(':email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @ApiOperation({ summary: 'Editar usuario especifico por id' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminr usuario epecifico por id' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'Solicitud de recuperacion de contrasena' })
  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload, { expiresIn: '1h' });
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);
      await this.usersService.setResetPasswordToken(email, token, expires);
      return { reset_token: token };
    }
    return { message: 'If email exists, reset token has been sent' };
  }

  @ApiOperation({ summary: 'Reestablecer contrasena' })
  @Post('reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.resetPassword(resetPasswordDto);
    if (user) {
      return { message: 'Password successfully reset' };
    }
    throw new BadRequestException('Invalid or expired token');
  }
}
