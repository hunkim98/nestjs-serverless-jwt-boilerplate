-- CreateTable
CREATE TABLE `tb_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isTermsAgreed` BOOLEAN NOT NULL,
    `isSnsAgreed` BOOLEAN NOT NULL,
    `currentHashedRefreshToken` VARCHAR(191) NULL,
    `socialLoginType` ENUM('GOOGLE') NULL,
    `socialLoginId` VARCHAR(191) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `verificationId` INTEGER NOT NULL,

    UNIQUE INDEX `tb_user_email_key`(`email`),
    UNIQUE INDEX `tb_user_nickname_key`(`nickname`),
    UNIQUE INDEX `tb_user_verificationId_key`(`verificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expireAt` DATETIME(3) NOT NULL,
    `code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_user` ADD CONSTRAINT `tb_user_verificationId_fkey` FOREIGN KEY (`verificationId`) REFERENCES `tb_verification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
