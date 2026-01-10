-- CreateEnum
CREATE TYPE "CharacterRelationType" AS ENUM ('parent', 'partner');

-- CreateEnum
CREATE TYPE "ParentType" AS ENUM ('father', 'mother', 'unknown');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('spouse', 'lover', 'unknown');

-- CreateTable
CREATE TABLE "character_relation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "CharacterRelationType" NOT NULL,
    "parentType" "ParentType",
    "partnerType" "PartnerType",
    "characterId" TEXT NOT NULL,
    "relatedCharacterId" TEXT NOT NULL,

    CONSTRAINT "character_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "character_relation_characterId_idx" ON "character_relation"("characterId");

-- CreateIndex
CREATE INDEX "character_relation_relatedCharacterId_idx" ON "character_relation"("relatedCharacterId");

-- CreateIndex
CREATE UNIQUE INDEX "character_relation_characterId_relatedCharacterId_type_key" ON "character_relation"("characterId", "relatedCharacterId", "type");

-- AddForeignKey
ALTER TABLE "character_relation" ADD CONSTRAINT "character_relation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_relation" ADD CONSTRAINT "character_relation_relatedCharacterId_fkey" FOREIGN KEY ("relatedCharacterId") REFERENCES "character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
