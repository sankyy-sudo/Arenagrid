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

export const app = express();
app.set("trust proxy", env.TRUST_PROXY_HOPS);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.APP_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Public uploaded media; MIME allowlist and size limits are applied by media.ts.
app.use("/uploads", express.static(path.resolve(env.MEDIA_STORAGE_PATH), {
  setHeaders(response) {
    // Uploaded documents must not execute scripts on the API origin.
    response.setHeader("Content-Security-Policy", "sandbox; default-src 'none'; style-src 'unsafe-inline'");
  }
}));

// Admin requests resolve a best-effort identity from the session cookie;
// protected routes still gate explicitly with requireAuth/requireRole.
app.use("/api/admin", authenticate);

// Public, unauthenticated API - leads endpoint is rate limited to blunt spam.
const leadsLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
app.use("/api/leads", leadsLimiter);
app.use("/api", publicRouter);

// Admin API - session required, CSRF required on every mutation.
app.use("/api/admin/auth", authRouter);
app.use("/api/admin", requireCsrf, adminRouter);

app.use("/api", (_request, response) => {
  response.status(404).json({ error: "API route not found" });
});
app.use(errorHandler);


