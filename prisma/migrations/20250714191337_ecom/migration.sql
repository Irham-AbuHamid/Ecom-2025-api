/*
  Warnings:

  - You are about to drop the column `oderedById` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `oderedById` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `productonoder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderedById` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderedById` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_oderedById_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_oderedById_fkey`;

-- DropForeignKey
ALTER TABLE `productonoder` DROP FOREIGN KEY `ProductOnOder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `productonoder` DROP FOREIGN KEY `ProductOnOder_productId_fkey`;

-- DropIndex
DROP INDEX `Cart_oderedById_fkey` ON `cart`;

-- DropIndex
DROP INDEX `Order_oderedById_fkey` ON `order`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `oderedById`,
    ADD COLUMN `orderedById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `oderedById`,
    ADD COLUMN `orderedById` INTEGER NOT NULL;

-- DropTable
DROP TABLE `productonoder`;

-- CreateTable
CREATE TABLE `ProductOnOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnOrder` ADD CONSTRAINT `ProductOnOrder_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductOnOrder` ADD CONSTRAINT `ProductOnOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
