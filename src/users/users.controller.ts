import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get() // Ruta http:localhost/users -> Get
    findAll() {
        return this.usersService.findAll();
    }

    //Crea la tabla en la BD y registra nuevos usuarios
    @Post() // Ruta http:localhost/users -> POST
    create(@Body() user: CreateUserDto) {

        return this.usersService.create(user);
    }

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)
    @Put(':id') // Ruta http://192.168.1.33/users/:id -> PUT
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {

        return this.usersService.update(id, user);
    }
    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtAuthGuard)
    @Post('upload/:id') // Validamos el tamaño y el tipo y subimos la imagen al servidor
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 *4 }), // 4MB
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              })
        ) file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number, 
        @Body() user: UpdateUserDto
    ) {
    return this.usersService.updateWithImage(file, id, user); // Subimos la imagen al firebase-storage
}


}
