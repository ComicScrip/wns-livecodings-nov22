import { MinLength } from "class-validator";
import { ObjectType, Field, InputType, Int } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import User from "./User";

@ObjectType()
@Entity()
export default class Photo {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  url: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.photos)
  @TypeormLoader()
  user: User;
}

@InputType()
export class PhotoInput {
  @Field()
  @MinLength(1)
  url: string;
}
