import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ description: 'Email del usuario a registrar'})
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contrasena del usuario a registrar'})
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}