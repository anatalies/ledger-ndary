/*
  Warnings:

  - Added the required column `adminId` to the `GroupTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetDate` to the `GroupTarget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CONTRIBUTION', 'ADJUSTMENT', 'OTHER');

-- AlterTable
ALTER TABLE "GroupTarget" ADD COLUMN     "adminId" INTEGER NOT NULL,
ADD COLUMN     "targetDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "contributionId" INTEGER,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupTarget" ADD CONSTRAINT "GroupTarget_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
