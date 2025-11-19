import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity
export class User{
    @PrimaryColumn()
    id! :string
    @Column()
    Nombre!: string
    @Column()
    rol!: string
    @Column(unique: true)
    email!:string


}