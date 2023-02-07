import "reflect-metadata";
import db from "./db";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { join } from "path";
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader";

async function start(): Promise<void> {
  await db.initialize();

  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [join(__dirname, "/resolvers/*.ts")],
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerLoaderPlugin({
        typeormGetConnection: () => db.manager.connection, // for use with TypeORM
      }),
    ],
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

start().catch(console.error);
