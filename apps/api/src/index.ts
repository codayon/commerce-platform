import { loadEnvFile } from "node:process";
import express from "express";
import database from "./config/database.ts";
import rootRouter from "./routes/index.ts";

loadEnvFile();

const app = express();
const port = 3000;

app.use(express.json());

app.use("/", rootRouter);

try {
  await database();
  app.listen(port, () => {
    console.log(`App listening at ${port}`);
  });
} catch (e) {
  console.error("Failed to start server:", e);
  process.exit(1);
}
