import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn("varchar", { length: 36 })
    id!: string;

    @Column("varchar", { length: 255 })
    name!: string;

    @Column("varchar", { length: 50 })
    rol!: string;

    @Column("varchar", { length: 255, unique: true })
    email!: string;
}