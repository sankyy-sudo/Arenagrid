BEGIN;
ALTER TABLE "Project"
  ADD COLUMN "beforeImageUrl" TEXT,
  ADD COLUMN "afterImageUrl" TEXT,
  ADD COLUMN "progress" INTEGER NOT NULL DEFAULT 0,
  ADD CONSTRAINT "Project_progress_range" CHECK ("progress" BETWEEN 0 AND 100);
COMMIT;
