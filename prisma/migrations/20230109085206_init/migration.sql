/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `firstname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `token` VARCHAR(191) NOT NULL;
