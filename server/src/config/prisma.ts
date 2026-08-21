import { PrismaClient } from "@prisma/client";

// Single shared Prisma instance (per PDF: PostgreSQL with Prisma ORM)
export const prisma = new PrismaClient();
