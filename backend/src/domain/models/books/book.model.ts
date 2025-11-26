import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryColumn("varchar", { length: 36 })
    id!: string;

    @Column("varchar", { length: 500 })
    titulo!: string;

    @Column("text")
    portadaBase64!: string;

    @Column("varchar", { length: 255 })
    authorName!: string;

    @Column("text")
    pdfBase64!: string;

    @Column("varchar", { length: 255 })
    genero!: string;

    @Column("varchar", { length: 50 })
    publishDate!: string;
}
