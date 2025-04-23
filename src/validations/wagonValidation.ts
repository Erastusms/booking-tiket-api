import { z } from "zod";

export const createWagonSchema = z.object({
    trainId: z.string().uuid({ message: "trainId must be a valid UUID" }),
    wagonCode: z
        .string()
        .min(1, { message: "wagonCode is required" })
        .max(10, { message: "wagonCode must be 10 characters or less" }),
    categoryId: z.string().uuid({ message: "categoryId must be a valid UUID" }),
});

export const createWagonCategorySchema = z.object({
    name: z.enum(["EKONOMI", "BISNIS", "EKSEKUTIF"], {
        required_error: "name is required and must be one of EKONOMI, BISNIS, EKSEKUTIF",
    }),
    capacity: z
        .number({ invalid_type_error: "capacity must be a number" })
        .int({ message: "capacity must be an integer" })
        .positive({ message: "capacity must be a positive number" }),
});
