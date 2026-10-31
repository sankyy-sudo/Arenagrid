-- Optional structured project specifications. Existing records remain unchanged.
ALTER TABLE "Project" ADD COLUMN "surface" TEXT,
ADD COLUMN "use" TEXT;
