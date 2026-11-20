-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENTE', 'TALLER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENTE';
