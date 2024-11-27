import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: 'El email del usuario a crear'})
  @IsString()
  email: string;

  @ApiProperty({ description: 'La password del usuario a crear'})
  @IsString()
  password: string;
}