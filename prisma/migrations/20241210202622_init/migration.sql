/*
  Warnings:

  - You are about to drop the `Instructuin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Instructuin` DROP FOREIGN KEY `Instructuin_recipeId_fkey`;

-- DropTable
DROP TABLE `Instructuin`;

-- CreateTable
CREATE TABLE `Instruction` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `step` INTEGER NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Instruction` ADD CONSTRAINT `Instruction_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
