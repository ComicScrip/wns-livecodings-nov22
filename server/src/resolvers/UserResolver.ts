import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import User from "../entity/User";
import datasource from "../db";
import { GraphQLError } from "graphql";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find();
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => Int) id: number): Promise<boolean> {
    const { affected } = await datasource.getRepository(User).delete(id);
    if (affected === 0) throw new GraphQLError("user not found");
    return true;
  }
}
