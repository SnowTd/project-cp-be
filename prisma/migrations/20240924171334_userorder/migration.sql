/*
  Warnings:

  - Added the required column `userRegister` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "userRegister" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userRegister_fkey" FOREIGN KEY ("userRegister") REFERENCES "UserRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
