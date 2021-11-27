/*
  Warnings:

  - You are about to drop the `_ConnectedGoogleTaskToPlannerItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `PlannerItem` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE `PlannerItem` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `_ConnectedGoogleTaskToPlannerItem`;

-- CreateTable
CREATE TABLE `PlannerItemOnConnGoogleTask` (
    `googleTaskId` VARCHAR(191) NOT NULL,
    `plannerItemId` VARCHAR(191) NOT NULL,
    `connectedGoogleTaskId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PlannerItemOnConnGoogleTask_connectedGoogleTaskId_key`(`connectedGoogleTaskId`),
    PRIMARY KEY (`plannerItemId`, `connectedGoogleTaskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
