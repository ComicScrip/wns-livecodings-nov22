import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import Wilder, {
  SkillId,
  WilderInput,
  WilderUpdateInput,
} from "../entity/Wilder";
import datasource from "../db";
import Grade from "../entity/Grade";
import { In } from "typeorm";
import { UserRole } from "../entity/User";

@Resolver(Wilder)
export class WilderResolver {
  @Query(() => [Wilder])
  async wilders(): Promise<Wilder[]> {
    const wilders = await datasource
      .getRepository(Wilder)
      .find({ relations: { grades: { skill: true } } });

    return wilders.map((w) => ({
      ...w,
      skills: w.grades.map((g) => ({
        id: g.skill.id,
        name: g.skill.name,
        votes: g.votes,
      })),
    }));
  }

  @Query(() => Wilder)
  async wilder(@Arg("id", () => Int) id: number): Promise<Wilder> {
    const wilder = await datasource
      .getRepository(Wilder)
      .findOne({ where: { id }, relations: { grades: { skill: true } } });

    if (wilder === null) throw new ApolloError("wilder not found", "NOT_FOUND");

    return {
      ...wilder,
      skills: wilder.grades.map((g) => ({
        id: g.skill.id,
        name: g.skill.name,
        votes: g.votes,
      })),
    };
  }

  @Mutation(() => Wilder)
  async createWilder(@Arg("data") data: WilderInput): Promise<Wilder> {
    const { name, avatarUrl, bio, city, skills = [] } = data;

    const { id } = await datasource.getRepository(Wilder).save({
      name,
      avatarUrl,
      bio,
      city,
    });

    if (typeof skills === "object")
      await datasource.getRepository(Grade).save(
        skills.map(({ id: skillId }) => ({
          skillId,
          wilderId: id,
        }))
      );

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

  @Authorized<UserRole>([UserRole.ADMIN])
  @Mutation(() => Boolean)
  async deleteWilder(@Arg("id", () => Int) id: number): Promise<boolean> {
    const { affected } = await datasource.getRepository(Wilder).delete(id);
    if (affected === 0) throw new ApolloError("wilder not found", "NOT_FOUND");
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

    if (wilderToUpdate === null)
      throw new ApolloError("wilder not found", "NOT_FOUND");

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
