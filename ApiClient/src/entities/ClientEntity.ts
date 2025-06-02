import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { IClient } from "../types/IClient";

@Entity("clients")
@Unique(["email"])
export class Client implements IClient {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  nome!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;
}
