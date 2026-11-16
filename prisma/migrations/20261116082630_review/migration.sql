/*
  Warnings:

  - Made the column `comment` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "review" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "comment" SET NOT NULL,
ALTER COLUMN "imageUrls" SET DEFAULT ARRAY[]::TEXT[];
