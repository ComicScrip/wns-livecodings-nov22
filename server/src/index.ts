import express from "express";
import db from "./db";
import wildersController from "./controller/wilders";
import skillsController from "./controller/skills";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server";
import Wilder from "./entity/Wilder";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

const typeDefs = gql`
  type SkillOfWilder {
    id: Int
    name: String
    votes: Int
  }

  type Wilder {
    id: Int
    name: String
    skills: [SkillOfWilder]
  }

  type Query {
    wilders: [Wilder]
  }

  type Mutation {
    createWilder(name: String!): Wilder
  }
`;

const resolvers = {
  Query: {
    wilders: async () => {
      const wilders = await db
        .getRepository(Wilder)
        .find({ relations: { grades: { skill: true } } });

      return wilders.map((wilder) => {
        return {
          ...wilder,
          grades: undefined,
          skills: wilder.grades.map((g) => {
            return {
              id: g.skill.id,
              name: g.skill.name,
              votes: g.votes,
            };
          }),
        };
      });
    },
  },
  Mutation: {
    async createWilder(_: any, args: { name: string }) {
      return await db.getRepository(Wilder).save(args);
    },
  },
};

const app = express();

app.use(express.json());
app.use(cors());

app.post("/wilders", wildersController.create);
app.get("/wilders", wildersController.read);
app.get("/wilders/:id", wildersController.readOne);
app.patch("/wilders/:id", wildersController.update);
app.delete("/wilders/:id", wildersController.delete);
app.post("/wilders/:wilderId/skills", wildersController.addSkill);
app.delete("/wilders/:wilderId/skills/:skillId", wildersController.removeSkill);
app.patch("/wilders/:wilderId/skills/:skillId", wildersController.updateGrade);

app.post("/skills", skillsController.create);
app.get("/skills", skillsController.read);
app.patch("/skills/:id", skillsController.update);
app.delete("/skills/:id", skillsController.delete);

async function start(): Promise<void> {
  await db.initialize();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  await server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

  app.listen(4001, () => {
    console.log("server ready");
  });
}

start().catch(console.error);
