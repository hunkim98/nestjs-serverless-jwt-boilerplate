/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `tb_verification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tb_verification_code_key` ON `tb_verification`(`code`);
