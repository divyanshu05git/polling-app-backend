/*
  Warnings:

  - A unique constraint covering the columns `[roomLink]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomLink` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomLink" TEXT NOT NULL,
ADD COLUMN     "roomName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomLink_key" ON "Room"("roomLink");
