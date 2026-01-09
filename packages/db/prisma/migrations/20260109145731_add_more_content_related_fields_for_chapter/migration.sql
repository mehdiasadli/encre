-- AlterTable
ALTER TABLE "chapter" ADD COLUMN     "draft" TEXT,
ADD COLUMN     "lastPublishedAt" TIMESTAMP(3),
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "words" INTEGER NOT NULL DEFAULT 0;
