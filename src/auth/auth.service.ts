import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                private jwtService: JwtService
){}

    async register(user: RegisterAuthDto){

        const {email, phone} = user;
        const emailExist = await this.userRepository.findOneBy({email: email})
        const phoneExist = await this.userRepository.findOneBy({phone: phone})

        if (emailExist){
            return new HttpException('The email is yet register', HttpStatus.CONFLICT);
        }
        if (phoneExist){
            return new HttpException('The phone is yet register', HttpStatus.CONFLICT);
        }


        const newUser = this.userRepository.create(user);
        const userSaved = await this.userRepository.save(newUser);
        const payload = { id: userSaved.id, name: userSaved.name};
        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }
        delete data.user.password;
        return data;
    }

    async login(loginData:LoginAuthDto){

        const {email, password} = loginData;
        const userFound = await this.userRepository.findOneBy({email: email});

        if (!userFound){
            return new HttpException('The email not exist', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await compare(password, userFound.password);
        if(!isPasswordValid){
            return new HttpException('Password Incorrect', HttpStatus.FORBIDDEN);
        }
        
        const payload = { id: userFound.id, name: userFound.name};
        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }
        delete data.user.password;

        return data;
    }

}
