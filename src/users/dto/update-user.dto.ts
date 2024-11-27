import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Email del usuario a modificar'})
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiProperty({ description: 'Contrasena del usuario a modificar'})
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength(20, { message: 'The password must not exceed 20 characters' })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
    message: 'The password must contain at least one letter and one number',
  })
  password?: string;
}
