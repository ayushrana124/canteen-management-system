// import type { Request, Response, NextFunction } from "express";
// import * as MenuService from "../services/menu.service.js";
// import { BadRequestError } from "../utils/appErrors.js";
// import  { MenuCategory } from "@prisma/client";

// export const getMenuByCanteenController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const canteenId = req.params.canteenId;

//     if (!canteenId) {
//       throw new BadRequestError("Canteen id is required");
//     }

//     const category = req.query.category as MenuCategory | undefined;

//     const result = await MenuService.getMenuByCanteen(canteenId, {
//       page: Number(req.query.page),
//       limit: Number(req.query.limit),
//       category,
//     });

//     res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// export const createMenuItemController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const canteenId = req.params.canteenId;

//     if (!canteenId) {
//       throw new BadRequestError("Canteen id is required");
//     }

//     const { name, price, category } = req.body;

//     if (!name || !price || !category) {
//       throw new BadRequestError("name, price and category are required");
//     }

//     const menuItem = await MenuService.createMenuItem(
//       canteenId,
//       req.user!, // injected by auth middleware
//       {
//         name,
//         price: Number(price),
//         category: category as MenuCategory,
//       }
//     );

//     res.status(201).json({
//       success: true,
//       data: menuItem,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const deleteMenuItemController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const menuId = req.params.menuId;

//     if (!menuId) {
//       throw new BadRequestError("Menu id is required");
//     }

//     const deletedMenu = await MenuService.deleteMenuItem(
//       menuId,
//       req.user!
//     );

//     res.status(200).json({
//       success: true,
//       data: deletedMenu,
//     });
//   } catch (err) {
//     next(err);
//   }
// };