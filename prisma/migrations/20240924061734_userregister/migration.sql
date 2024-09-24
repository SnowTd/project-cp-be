/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "UserRegister" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "Address" TEXT NOT NULL,

    CONSTRAINT "UserRegister_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRegister" ADD CONSTRAINT "UserRegister_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
