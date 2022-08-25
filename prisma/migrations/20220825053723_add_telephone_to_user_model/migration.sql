/*
  Warnings:

  - Added the required column `telephone` to the `tb_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_user` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `telephone` VARCHAR(191) NOT NULL;
