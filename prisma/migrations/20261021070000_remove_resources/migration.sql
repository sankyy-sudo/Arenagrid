-- Resources feature removal. Applying this migration permanently deletes only
-- Resource records and their join rows. Shared media, SEO, products and sports remain.
BEGIN;

ALTER TABLE "Resource" DROP CONSTRAINT "Resource_fileId_fkey";
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_seoId_fkey";
ALTER TABLE "_ResourceProducts" DROP CONSTRAINT "_ResourceProducts_A_fkey";
ALTER TABLE "_ResourceProducts" DROP CONSTRAINT "_ResourceProducts_B_fkey";
ALTER TABLE "_ResourceSports" DROP CONSTRAINT "_ResourceSports_A_fkey";
ALTER TABLE "_ResourceSports" DROP CONSTRAINT "_ResourceSports_B_fkey";

DROP TABLE "Resource";
DROP TABLE "_ResourceProducts";
DROP TABLE "_ResourceSports";

COMMIT;
