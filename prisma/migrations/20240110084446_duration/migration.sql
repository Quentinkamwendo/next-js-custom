/*
  Warnings:

  - You are about to alter the column `duration` on the `project` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Int`.

*/
-- AlterTable
ALTER TABLE `project` MODIFY `duration` INTEGER NULL;
