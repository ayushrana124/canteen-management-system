/*
  Warnings:

  - A unique constraint covering the columns `[canteenId,name]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MenuCategory" AS ENUM ('BEVERAGES', 'SNACKS', 'MEALS', 'CHINESE', 'DESSERTS');

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "category" "MenuCategory" NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_canteenId_name_key" ON "Menu"("canteenId", "name");
