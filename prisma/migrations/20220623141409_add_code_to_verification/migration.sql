/*
  Warnings:

  - Added the required column `code` to the `tb_verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tb_user` DROP FOREIGN KEY `tb_user_verificationId_fkey`;

-- AlterTable
ALTER TABLE `tb_verification` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_user` ADD CONSTRAINT `tb_user_verificationId_fkey` FOREIGN KEY (`verificationId`) REFERENCES `tb_verification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
