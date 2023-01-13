import { DataSource } from "typeorm";
import { join } from "path";

const datasource = new DataSource({
  type: "postgres",
  host: "db",
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  entities: [join(__dirname, "/entity/*.ts")],
  logging: ["query", "error"],
});

export default datasource;
