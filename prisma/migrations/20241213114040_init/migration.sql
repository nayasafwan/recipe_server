/*
  Warnings:

  - The values [Snack] on the enum `Recipe_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Recipe` MODIFY `category` ENUM('Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Appetizer', 'Beverage', 'Dessert', 'Soup', 'Salad') NOT NULL;
