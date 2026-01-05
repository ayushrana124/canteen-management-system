import MenuCategories from "@prisma/client";

export interface GetMenuByCanteenOptions {
  page?: number;
  limit?: number;
  category?: MenuCategory;
};

export interface CreateMenuItemDTO {
  name: string;
  price: number;
  category: MenuCategory;
};