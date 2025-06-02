import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("favorites")
@Unique(["clientId", "productId"])
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  clientId!: string;

  @Column({ type: "int" })
  productId!: number;
}
