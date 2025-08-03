/*
  Warnings:

  - You are about to drop the column `oderStatus` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `oderStatus`,
    ADD COLUMN `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING';
