import { loadEnvFile } from "node:process";
loadEnvFile();

import express from "express";
import database from "./config/database.js";
import rootRouter from "./routes/index.js";

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
