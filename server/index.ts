import { app } from "./app";
import { env } from "./config";
import { prisma } from "./db";

const server = app.listen(env.PORT, () => {
  console.log(`Arena Grid Infra API listening on http://localhost:${env.PORT}`);
});

server.on("error", (error) => {
  console.error("API failed to start:", error.message);
  process.exitCode = 1;
});

function shutdown() {
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit());
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
