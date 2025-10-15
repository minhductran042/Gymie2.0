/*
  Warnings:

  - Changed the type of `method` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HTTPMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD');

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "method",
ADD COLUMN     "method" "HTTPMethod" NOT NULL;
