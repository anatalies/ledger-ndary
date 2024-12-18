/*
  Warnings:

  - Added the required column `groupTargetId` to the `Contribution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "groupTargetId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_groupTargetId_fkey" FOREIGN KEY ("groupTargetId") REFERENCES "GroupTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
