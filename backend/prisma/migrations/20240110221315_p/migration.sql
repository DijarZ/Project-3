/*
  Warnings:

  - You are about to drop the column `state` on the `users` table. All the data in the column will be lost.
  - Added the required column `country` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `state`,
    ADD COLUMN `country` VARCHAR(191) NOT NULL;
