/*
  Warnings:

  - You are about to drop the column `username` on the `tb_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `tb_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isSnsAgreed` to the `tb_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTermsAgreed` to the `tb_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tb_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_user` DROP COLUMN `username`,
    ADD COLUMN `isSnsAgreed` BOOLEAN NOT NULL,
    ADD COLUMN `isTermsAgreed` BOOLEAN NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tb_user_nickname_key` ON `tb_user`(`nickname`);
