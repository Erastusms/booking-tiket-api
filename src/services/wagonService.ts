import prisma from "../config/prisma";

// Wagon
export const createWagonService = async (data: {
    trainId: string;
    wagonCode: string;
    categoryId: string;
}) => {
    return await prisma.wagon.create({ data });
};

export const deleteWagonService = async (id: string) => {
    return await prisma.wagon.delete({ where: { id } });
};

// Wagon_Category
export const createCategoryService = async (data: {
    name: "EKONOMI" | "BISNIS" | "EKSEKUTIF";
    capacity: number;
}) => {
    return await prisma.wagonCategory.create({ data });
};

export const getAllCategoryService = async () => {
    return await prisma.wagonCategory.findMany();
};

export const deleteCategoryService = async (id: string) => {
    return await prisma.wagonCategory.delete({ where: { id } });
};
