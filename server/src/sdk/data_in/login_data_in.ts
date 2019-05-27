import { IsEmail, IsString } from 'class-validator';

export class LoginDataIn {
  @IsEmail() email: string;
  @IsString() password: string;
}
