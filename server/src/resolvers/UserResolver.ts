import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import User, { UserInput } from "../entity/User";
import datasource from "../db";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find();
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: UserInput): Promise<User> {
    const { photos } = data;

    const newUser = await datasource.getRepository(User).save({
      photos,
    });

    return newUser;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => Int) id: number): Promise<boolean> {
    const { affected } = await datasource.getRepository(User).delete(id);
    if (affected === 0) throw new ApolloError("User not found", "NOT_FOUND");
    return true;
  }
}
