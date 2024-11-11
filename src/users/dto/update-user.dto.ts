import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {

    
    @IsString()
    name?: String;

    
    @IsString()
    lastname?: String;

    
    @IsString()
    phone?: String;

    image?: String;
    notification_token?: String;
}