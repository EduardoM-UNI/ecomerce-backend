import { isEmail, IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginAuthDto{

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    
}