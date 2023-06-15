import { ApolloError } from "apollo-server-errors";
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import datasource from "../db";
import User, {
  hashPassword,
  NotificationInput,
  UpdateUserInput,
  UserInput,
  UserRole,
  verifyPassword,
} from "../entity/User";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { ContextType } from "..";
import { Expo } from "expo-server-sdk";
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

@Resolver(() => User)
class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("data") { email, password }: UserInput): Promise<User> {
    const exisitingUser = await datasource
      .getRepository(User)
      .findOne({ where: { email } });

    if (exisitingUser !== null) throw new ApolloError("EMAIL_ALREADY_EXISTS");

    const hashedPassword = await hashPassword(password);
    return await datasource.getRepository(User).save({ email, hashedPassword });
  }

  @Mutation(() => String)
  async login(
    @Arg("data") { email, password }: UserInput,
    @Ctx() { res }: ContextType
  ): Promise<string> {
    const user = await datasource.getRepository(User).findOneBy({ email });

    if (user === null || !(await verifyPassword(password, user.hashedPassword)))
      throw new ApolloError("invalid credentials", "INVALID_CREDS");

    // https://www.npmjs.com/package/jsonwebtoken
    const token = jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);

    // https://stackoverflow.com/a/40135050
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

  @Authorized()
  @Mutation(() => User)
  async updateProfile(
    @Arg("data") data: UpdateUserInput,
    @Ctx() { currentUser }: ContextType
  ): Promise<User> {
    if (typeof currentUser === "undefined") throw new Error("no current user");
    return await datasource
      .getRepository(User)
      .save({ ...currentUser, ...data });
  }

  @Authorized<UserRole[]>([UserRole.ADMIN])
  @Mutation(() => Boolean)
  async sendNotification(
    @Arg("userId", () => Int) id: number,
    @Arg("data", { validate: false }) data: NotificationInput
  ): Promise<Boolean> {
    const user = await datasource.getRepository(User).findOne({
      where: { id },
    });
    if (user === null) throw new Error("NOT_FOUND");

    if (typeof user.expoNotificationToken === "undefined")
      throw new Error("user has no registered device token");

    await expo.sendPushNotificationsAsync([
      {
        to: user.expoNotificationToken,
        title: data.title,
        body: data.body,
        data:
          typeof data.JSONPayload === "string"
            ? JSON.parse(data.JSONPayload)
            : undefined,
      },
    ]);

    return true;
  }
}

export default UserResolver;
