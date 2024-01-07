/*
  Warnings:

  - Added the required column `totalAmount` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderitems` ADD COLUMN `totalAmount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
