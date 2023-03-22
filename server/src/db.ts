import { DataSource } from "typeorm";
import { env } from "./env";
import Wilder from "./entity/Wilder";
import User from "./entity/User";
import Skill from "./entity/Skill";
import Grade from "./entity/Grade";

const datasource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  entities: [Wilder, User, Skill, Grade],
  logging: ["error"],
});

export default datasource;
