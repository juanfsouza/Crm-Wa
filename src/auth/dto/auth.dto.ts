import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
