/*
  Warnings:

  - Added the required column `quantity` to the `ShopingCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shopingcart` ADD COLUMN `quantity` INTEGER NOT NULL;
