import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {

constructor(private AuthService:AuthService){}

@Post('register') //http://localhost/auth/register
register(@Body() user: RegisterUserDto){
    return this.AuthService.register(user);
}


}
