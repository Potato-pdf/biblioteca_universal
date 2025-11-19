import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryColumn("varchar", { length: 36 })
    id!: string;

    @Column("varchar", { length: 500 })
    name!: string;

    @Column("text")
    imageUrl!: string;

    @Column("varchar", { length: 255 })
    authorName!: string;

    @Column("text")
    pdfUrl!: string;

    @Column("text")
    description!: string;

    @Column("varchar", { length: 50 })
    publishDate!: string;
}
