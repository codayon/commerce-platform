import { loadEnvFile } from "node:process";
loadEnvFile();

import express from "express";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import database from "./config/database.js";
import { openapiSpec } from "./config/swagger.js";
import rootRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();
const port = 3000;

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined");
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/", rootRouter);

app.use(errorHandler);

try {
  await database();
  app.listen(port, () => {
    console.log(`App listening at ${port}`);
  });
} catch (err) {
  console.error("Failed to start server:", err);
  process.exit(1);
}
