BEGIN;
ALTER TABLE "Industry"
  ADD COLUMN "imageUrl" TEXT,
  ADD COLUMN "solution" TEXT;
COMMIT;
