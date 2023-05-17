import "reflect-metadata";
import db from "./db";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { join } from "path";
import express from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";
import User from "./entity/User";
import cookie from "cookie";

export interface JWTPayload {
  userId: number;
}

export interface ContextType {
  req: express.Request;
  res: express.Response;
  currentUser?: User;
}

async function start(): Promise<void> {
  await db.initialize();

  const schema = await buildSchema({
    resolvers: [join(__dirname, "/resolvers/*.ts")],
    authChecker: async ({ context }: { context: ContextType }, roles = []) => {
      const { req } = context;
      const tokenInAuthHeaders = req.headers.authorization?.split(" ")[1];
      const tokenInCookie = cookie.parse(req.headers.cookie ?? "").token;

      console.log({ tokenInAuthHeaders, tokenInCookie });

      const token = tokenInAuthHeaders ?? tokenInCookie;
      if (typeof token !== "string") return false;

      const decoded = jwt.verify(token, env.JWT_PRIVATE_KEY) as JWTPayload;
      if (typeof decoded !== "object") return false;

      const id = decoded.userId;
      const currentUser = await db.getRepository(User).findOneBy({ id });
      if (currentUser === null) return false;

      context.currentUser = currentUser;
      return roles.length === 0 || roles.includes(currentUser.role);
    },
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    context: ({ req, res }) => ({ req, res }),
    cors: {
      origin: env.CORS_ALLOWED_ORIGINS.split(","),
      credentials: true,
    },
  });

  await server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

start().catch(console.error);
