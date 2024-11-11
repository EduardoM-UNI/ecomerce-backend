import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async register(user: RegisterUserDto){

        const emailExist = await this.userRepository.findOneBy({email: user.email})
        const phoneExist = await this.userRepository.findOneBy({phone: user.phone})

        if (emailExist){
            return new HttpException('The email is yet register', HttpStatus.CONFLICT);
        }
        if (phoneExist){
            return new HttpException('The phone is yet register', HttpStatus.CONFLICT);
        }


        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

}
