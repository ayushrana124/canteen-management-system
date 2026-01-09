// import prisma from "../config/db.js"
// import { ConflictError, ForbiddenError, NotFoundError } from "../utils/appErrors.js";
// import type { GetMenuByCanteenOptions } from "../dtos/menu.dtos.js";
// import type { CreateMenuItemDTO } from "../dtos/menu.dtos.js";


// export const getMenuByCanteen = async (
//   canteenId: string,
//   options: GetMenuByCanteenOptions = {}
// ) => {
//   const page = options.page ?? 1;
//   const limit = Math.min(options.limit ?? 20, 50);
//   const skip = (page - 1) * limit;

//   // 1️⃣ Validate canteen
//   const canteenExists = await prisma.canteen.findFirst({
//     where: {
//       id: canteenId,
//       isActive: true,
//     },
//     select: { id: true },
//   });

//   if (!canteenExists) {
//     throw new NotFoundError("Canteen not found");
//   }

//   // 2️⃣ Build filter
//   const where: any = {
//     canteenId,
//     isAvailable: true,
//     isActive: true,
//   };

//   if (options.category) {
//     where.category = options.category;
//   }

//   // 3️⃣ Fetch data + count atomically
//   const [menus, total] = await prisma.$transaction([
//     prisma.menu.findMany({
//       where,
//       orderBy: { name: "asc" },
//       skip,
//       take: limit,
//       select: {
//         id: true,
//         name: true,
//         price: true,
//         category: true,
//       },
//     }),
//     prisma.menu.count({ where }),
//   ]);

//   return {
//     data: menus,
//     meta: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };



// export const createMenuItem = async (
//   canteenId: string,
//   currentUser: { userId: string; role: string },
//   data: CreateMenuItemDTO
// ) => {
//   return prisma.$transaction(async (tx) => {
//     // 1️⃣ Validate canteen & ownership
//     const canteen = await tx.canteen.findFirst({
//       where: {
//         id: canteenId,
//         isActive: true,
//       },
//       select: {
//         id: true,
//         managerId: true,
//       },
//     });

//     if (!canteen) {
//       throw new NotFoundError("Canteen not found");
//     }

//     if (
//       currentUser.role !== "MANAGER" ||
//       canteen.managerId !== currentUser.userId
//     ) {
//       throw new ForbiddenError("Not allowed to add menu items");
//     }

//     // 2️⃣ Prevent duplicate menu items per canteen
//     const existingItem = await tx.menu.findFirst({
//       where: {
//         canteenId,
//         name: data.name.trim(),
//         isActive: true,
//       },
//       select: { id: true },
//     });

//     if (existingItem) {
//       throw new ConflictError("Menu item already exists");
//     }

//     // 3️⃣ Create menu item
//     return tx.menu.create({
//       data: {
//         name: data.name.trim(),
//         price: data.price,
//         category: data.category,
//         canteenId,
//       },
//       select: {
//         id: true,
//         name: true,
//         price: true,
//         category: true,
//       },
//     });
//   });
// };


// export const deleteMenuItem = async (
//   menuId: string,
//   currentUser: { userId: string; role: string }
// ) => {
//   return prisma.$transaction(async (tx) => {
//     // 1️⃣ Fetch menu with ownership
//     const menu = await tx.menu.findFirst({
//       where: {
//         id: menuId,
//         isActive: true,
//       },
//       select: {
//         id: true,
//         name: true,
//         canteen: {
//           select: {
//             managerId: true,
//           },
//         },
//       },
//     });

//     if (!menu) {
//       throw new NotFoundError("Menu item not found");
//     }

//     // 2️⃣ Authorization
//     if (
//       currentUser.role !== "MANAGER" ||
//       menu.canteen.managerId !== currentUser.userId
//     ) {
//       throw new ForbiddenError("Not allowed to delete this menu item");
//     }

//     // 3️⃣ Soft delete
//     return tx.menu.update({
//       where: { id: menuId },
//       data: {
//         isActive: false,
//         isAvailable: false,
//       },
//       select: {
//         id: true,
//         name: true,
//       },
//     });
//   });
// };