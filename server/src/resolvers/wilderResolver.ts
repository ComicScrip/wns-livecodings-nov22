import {
  Arg,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { GraphQLError } from "graphql";
import Wilder, {
  SkillId,
  SkillOfWilder,
  WilderInput,
  WilderUpdateInput,
} from "../entity/Wilder";
import datasource from "../db";
import Grade from "../entity/Grade";
import { In } from "typeorm";
import { Loader } from "type-graphql-dataloader";
import DataLoader from "dataloader";
import { groupBy } from "lodash";

@Resolver(Wilder)
export class WilderResolver {
  @FieldResolver()
  @Loader<number, SkillOfWilder[]>(async (wilderIds) => {
    const grades = await datasource.getRepository(Grade).find({
      where: { wilderId: In([...wilderIds]) },
      relations: { skill: true },
    });
    const byWilderId = groupBy(grades, "wilderId");
    return wilderIds.map(
      (id) =>
        byWilderId[id]?.map(({ skill, votes }) => ({ ...skill, votes })) ?? []
    );
  })
  async skills(@Root() wilder: Wilder): Promise<any> {
    console.log("test");

    return async (dataloader: DataLoader<number, SkillOfWilder[]>) =>
      await dataloader.load(wilder.id);
  }

  @Query(() => [Wilder])
  async wilders(): Promise<Wilder[]> {
    return await datasource.getRepository(Wilder).find();
  }

  @Query(() => Wilder)
  async wilder(@Arg("id", () => Int) id: number): Promise<Wilder> {
    const wilder = await datasource
      .getRepository(Wilder)
      .findOne({ where: { id }, relations: { grades: { skill: true } } });

    if (wilder === null) throw new GraphQLError("wilder not found");

    return wilder;
  }

  @Mutation(() => Wilder)
  async createWilder(@Arg("data") data: WilderInput): Promise<Wilder> {
    const { name, avatarUrl, bio, city, skills = [] } = data;

    const newWilder = await datasource.getRepository(Wilder).save({
      name,
      avatarUrl,
      bio,
      city,
    });

    if (typeof skills === "object")
      await datasource.getRepository(Grade).save(
        skills.map(({ id: skillId }) => ({
          skillId,
          wilderId: newWilder.id,
        }))
      );

    return newWilder;
  }

  @Mutation(() => Boolean)
  async deleteWilder(@Arg("id", () => Int) id: number): Promise<boolean> {
    const { affected } = await datasource.getRepository(Wilder).delete(id);
    if (affected === 0) throw new GraphQLError("wilder not found");
    return true;
  }

  @Mutation(() => Wilder)
  async updateWilder(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: WilderUpdateInput
  ): Promise<Wilder> {
    const { name, bio, avatarUrl, city, skills } = data;
    const wilderToUpdate = await datasource.getRepository(Wilder).findOne({
      where: { id },
      relations: { grades: { skill: true } },
    });

    if (wilderToUpdate === null) throw new GraphQLError("wilder not found");

    await datasource
      .getRepository(Wilder)
      .save({ id, name, bio, city, avatarUrl });

    const existingSkillIds = wilderToUpdate.grades.map((g) => g.skill.id);
    const newSkillIds = (typeof skills === "undefined" ? [] : skills).map(
      (s: SkillId) => s.id
    );
    const skillIdsToAdd = newSkillIds.filter(
      (newId) => !existingSkillIds.includes(newId)
    );
    const skillsToRemove = existingSkillIds.filter(
      (existingId) => !newSkillIds.includes(existingId)
    );

    await datasource.getRepository(Grade).save(
      skillIdsToAdd.map((skillId) => ({
        skillId,
        wilderId: wilderToUpdate.id,
      }))
    );

    if (typeof skills === "object")
      await datasource
        .getRepository(Grade)
        .delete({ wilderId: wilderToUpdate.id, skillId: In(skillsToRemove) });

    const toReturn = await datasource.getRepository(Wilder).findOneOrFail({
      where: { id },
      relations: { grades: { skill: true } },
    });
    toReturn.skills = toReturn.grades.map(({ skill, votes }) => ({
      ...skill,
      votes,
    }));

    return toReturn;
  }
}
