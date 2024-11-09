import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    lastname: string;
    @Column({unique: true})
    email: string;
    @Column({unique: true})
    phone: string;
    @Column({nullable: true})
    image: string;
    @Column()
    pasword: string;
    @Column({nullable: true})
    notification_token: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    create_at: Date;
    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    update_at: Date;




}