import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";
import { errorHandler } from "./errors";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.APP_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Arena Grid Infra API listening on http://localhost:${env.PORT}`);
});
