-- DropIndex
DROP INDEX "review_productId_idx";

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "imagePublicIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "review_productId_createdAt_idx" ON "review"("productId", "createdAt");
