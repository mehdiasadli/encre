-- CreateEnum
CREATE TYPE "FeedbackPriority" AS ENUM ('unset', 'low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "FeedbackSource" AS ENUM ('website');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('pending', 'reviewed', 'rejected', 'resolved', 'deleted');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('bug', 'security', 'feature_request', 'complaint', 'other');

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'pending',
    "source" "FeedbackSource" NOT NULL DEFAULT 'website',
    "priority" "FeedbackPriority" NOT NULL DEFAULT 'unset',
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "response" TEXT,
    "responseAt" TIMESTAMP(3),
    "responseById" TEXT,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_responseById_fkey" FOREIGN KEY ("responseById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
