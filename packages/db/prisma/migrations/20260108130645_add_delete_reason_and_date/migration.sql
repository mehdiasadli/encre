-- CreateEnum
CREATE TYPE "DeletionResource" AS ENUM ('serie', 'book', 'chapter', 'character');

-- AlterTable
ALTER TABLE "book" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionReason" "DeletionResource";

-- AlterTable
ALTER TABLE "chapter" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionReason" "DeletionResource";

-- AlterTable
ALTER TABLE "character" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionReason" "DeletionResource";

-- AlterTable
ALTER TABLE "serie" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionReason" "DeletionResource" NOT NULL DEFAULT 'serie';
