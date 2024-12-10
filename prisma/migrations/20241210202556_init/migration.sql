/*
  Warnings:

  - The values [Vegeterian] on the enum `Recipe_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Ingredient` MODIFY `measuringUnit` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `category` ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Appetizer', 'Beverage', 'Dessert', 'Soup', 'Salad') NOT NULL;

-- CreateTable
CREATE TABLE `Instructuin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `step` INTEGER NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Instructuin` ADD CONSTRAINT `Instructuin_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
