/*
  Warnings:

  - You are about to drop the column `roomLink` on the `Room` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Room_roomLink_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomLink";
