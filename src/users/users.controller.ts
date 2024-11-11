import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get() // Ruta http:localhost/users -> Get
    findAll() {
        return this.usersService.findAll();
    }

    //Crea la tabla en la BD y registra nuevos usuarios
    @Post() // Ruta http:localhost/users -> POST
    create(@Body() user: CreateUserDto) {

        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id') // Ruta http://192.168.1.33/users/:id -> PUT
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {

        return this.usersService.update(id, user);
    }

    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 *4 }), // 4MB
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              })
        ) file: Express.Multer.File) {
    console.log(file);
    this.usersService.updateWithImage(file);
}


}
