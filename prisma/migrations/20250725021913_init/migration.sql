/*
  Warnings:

  - You are about to drop the column `assetId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `secureUrl` on the `image` table. All the data in the column will be lost.
  - Added the required column `asset_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secure_url` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentcy` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` DROP COLUMN `assetId`,
    DROP COLUMN `publicId`,
    DROP COLUMN `secureUrl`,
    ADD COLUMN `asset_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `secure_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `currentcy` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripePaymentId` VARCHAR(191) NOT NULL,
    MODIFY `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'Not Process';

-- AlterTable
ALTER TABLE `user` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'user';
