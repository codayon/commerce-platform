import { loadEnvFile } from "node:process";
loadEnvFile();

import express from "express";
import database from "./config/database.js";
import rootRouter from "./routes/index.js";
import session from "express-session";

const app = express();
const port = 3000;

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(express.json());
app.use("/", rootRouter);

try {
  await database();
  app.listen(port, () => {
    console.log(`App listening at ${port}`);
  });
} catch (err) {
  console.error("Failed to start server:", err);
  process.exit(1);
}
