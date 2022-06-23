/*
  Warnings:

  - You are about to drop the `Verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tb_user` DROP FOREIGN KEY `tb_user_verificationId_fkey`;

-- DropTable
DROP TABLE `Verification`;

-- CreateTable
CREATE TABLE `tb_verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expireAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_user` ADD CONSTRAINT `tb_user_verificationId_fkey` FOREIGN KEY (`verificationId`) REFERENCES `tb_verification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
