import { Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Grade from "./Grade";

@InputType()
export class SkillInput {
  @Field()
  @Length(1, 30)
  name: string;
}

@Entity()
@ObjectType()
class Skill {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Grade, (grade) => grade.skill)
  grades?: Grade[];
}

export default Skill;
