/*
  Warnings:

  - Added the required column `serieId` to the `article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "article" ADD COLUMN     "serieId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "chapter" ADD COLUMN     "editedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
