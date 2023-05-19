import { argon2id, hash, verify } from "argon2";
import { IsEmail, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  ADMIN = "admin",
  VISTOR = "visitor",
}

@ObjectType()
@Entity()
class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Field()
  @Column({ default: UserRole.VISTOR, enum: UserRole })
  role: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  expoNotificationToken?: string;
}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class NotificationInput {
  @Field()
  title: string;

  @Field()
  body: string;

  @Field({ nullable: true })
  JSONPayload?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  expoNotificationToken?: string;
}

const hashingOptions = {
  type: argon2id,
  memoryCost: 2 ** 16,
};

export async function hashPassword(plain: string): Promise<string> {
  return await hash(plain, hashingOptions);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await verify(hashed, plain, hashingOptions);
}

export default User;
