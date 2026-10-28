BEGIN;

-- Add independent editable lists without dropping existing specifications or sports.
ALTER TABLE "Product"
  ADD COLUMN "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "bestFor" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Preserve the content previously displayed on product cards.
UPDATE "Product" AS p
SET "features" = ARRAY(
  SELECT s."name" || ': ' || s."value" ||
    CASE WHEN COALESCE(s."unit", '') = '' THEN '' ELSE ' ' || s."unit" END
  FROM "ProductSpecification" AS s
  WHERE s."productId" = p."id"
  ORDER BY s."order", s."id"
  LIMIT 3
),
"bestFor" = ARRAY(
  SELECT s."name"
  FROM "_ProductSports" AS ps
  JOIN "Sport" AS s ON s."id" = ps."B"
  WHERE ps."A" = p."id" AND s."status" = 'PUBLISHED'
  ORDER BY s."name"
);

COMMIT;
