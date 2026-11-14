/*
  Warnings:

  - You are about to drop the column `password` on the `pending_registration` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `pending_registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pending_registration" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL;
