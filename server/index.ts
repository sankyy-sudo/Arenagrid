import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config";
import { adminRouter } from "./routes/admin";
import { authRouter } from "./routes/auth";
import { publicRouter } from "./routes/public";
import { errorHandler } from "./errors";
import { authenticate, requireCsrf } from "./middleware/auth";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.APP_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Public uploaded media (images/pdfs only, validated at upload time in media.ts).
app.use("/uploads", express.static(path.resolve(env.MEDIA_STORAGE_PATH)));

// Every request gets a best-effort identity from its session cookie; routes
// that need auth still gate explicitly with requireAuth/requireRole.
app.use(authenticate);

// Public, unauthenticated API - leads endpoint is rate limited to blunt spam.
const leadsLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
app.use("/api/leads", leadsLimiter);
app.use("/api", publicRouter);

// Admin API - session required, CSRF required on every mutation.
app.use("/api/admin/auth", authRouter);
app.use("/api/admin", requireCsrf, adminRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Arena Grid Infra API listening on http://localhost:${env.PORT}`);
});