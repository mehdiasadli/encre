/*
  Warnings:

  - You are about to drop the column `visibility` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "visibility";

-- AlterTable
ALTER TABLE "chapter" DROP COLUMN "visibility";
