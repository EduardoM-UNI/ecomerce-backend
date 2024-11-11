import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import storage = require('../utils/cloud_storage');

@Injectable()
export class UsersService {

    constructor(   
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    create(user: CreateUserDto) {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    findAll(){
        return this.userRepository.find();
    }

    async update (id: number, user: UpdateUserDto){
        const userFound = await this.userRepository.findOneBy({id: id});

        if (!userFound){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updatedUser = Object.assign(userFound, user);
        return this.userRepository.save(updatedUser);
    }

    async updateWithImage(file: Express.Multer.File){
        const url = await storage(file, file.originalname);
        console.log('URL: ' + url);
    }

}
