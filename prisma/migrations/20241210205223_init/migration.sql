/*
  Warnings:

  - You are about to drop the column `step` on the `Instruction` table. All the data in the column will be lost.
  - Added the required column `order` to the `Instruction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Instruction` DROP COLUMN `step`,
    ADD COLUMN `order` INTEGER NOT NULL;
