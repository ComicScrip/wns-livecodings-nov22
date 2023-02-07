import { ValidateNested } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Photo, { PhotoInput } from "./Photo";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => [Photo])
  @OneToMany((type) => Photo, (photo) => photo.user, {
    cascade: true,
  })
  @TypeormLoader()
  photos: Photo[];
}

@InputType()
export class UserInput {
  @ValidateNested()
  @Field(() => [PhotoInput])
  photos: PhotoInput[];
}

export default User;
