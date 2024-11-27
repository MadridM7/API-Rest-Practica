import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'El email del usuario a recuperar contrasena'})
  @IsEmail()
  @IsNotEmpty()
  email: string;
}