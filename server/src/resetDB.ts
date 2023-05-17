import datasource from "./db";
import User, { hashPassword } from "./entity/User";

async function reset(): Promise<void> {
  await datasource.initialize();
  await datasource.getRepository(User).delete({});
  await datasource.getRepository(User).save([
    {
      email: "user@app.com",
      hashedPassword: await hashPassword("test@123"),
    },
    {
      email: "admin@app.com",
      hashedPassword: await hashPassword("test@123"),
      role: "admin",
    },
  ]);
  await datasource.destroy();
  console.log("done!");
}

reset().catch(console.error);
