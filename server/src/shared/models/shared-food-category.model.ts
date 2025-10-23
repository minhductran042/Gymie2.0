import { Prisma } from "@prisma/client";
import z from "zod";

export const FoodCategorySchema = z.object({
    id: z.number(),
    code: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
});

export type FoodCategoryType = z.infer<typeof FoodCategorySchema>;
