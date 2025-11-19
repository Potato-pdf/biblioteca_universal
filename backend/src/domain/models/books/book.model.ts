import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity
export class Book{
    @PrimaryColumn()
    id! :string
    @Column()
    name!:string
    @Column()
    imageUrl!:string
    @Column()
    authorName!:string
    @Column()
    pdfUrl! : string 
    @Column()
    description!: string
    @Column()
    publishDate!:string
}
