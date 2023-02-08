import { ApolloError } from "apollo-server-errors";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../db";
import User, { hashPassword, UserInput, verifyPassword } from "../entity/User";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { ContextType } from "..";

@Resolver(() => User)
class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("data") { email, password }: UserInput): Promise<User> {
    const hashedPassword = await hashPassword(password);
    return await datasource.getRepository(User).save({ email, hashedPassword });
  }

  @Mutation(() => String)
  async login(
    @Arg("data") { email, password }: UserInput,
    @Ctx() { res }: ContextType
  ): Promise<string> {
    const user = await datasource.getRepository(User).findOneBy({ email });

    console.log({ user });

    if (user === null || !(await verifyPassword(password, user.hashedPassword)))
      throw new ApolloError("invalid credentials", "INVALID_CREDS");

    const token = jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    });

    return token;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: ContextType): Promise<boolean> {
    res.clearCookie("token");
    return true;
  }

  @Authorized()
  @Query(() => User)
  async profile(@Ctx() { currentUser }: ContextType): Promise<User> {
    return currentUser as User;
  }
}

export default UserResolver;
