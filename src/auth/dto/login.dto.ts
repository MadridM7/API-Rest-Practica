import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: 'Email del usuario a logear'})
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contrasena del usuario a logear'})
  @IsString()
  @MinLength(8)
  @Transform(({ value }) => value.trim())
  password: string;
}