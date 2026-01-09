// import { Router } from "express";
// import {
//   getMenuByCanteen,
//   createMenuItem,
//   updateMenuItem,
//   deleteMenuItem,
// } from "../controllers/menu.controller.js";

// import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

// const router = Router();

// // View menu (student + manager)
// router.get("/canteens/:canteenId/menu", authenticate, getMenuByCanteen);

// // Manager only
// router.post(
//   "/canteens/:canteenId/menu",
//   authenticate,
//   authorizeRoles("MANAGER"),
//   createMenuItem
// );

// router.patch(
//   "/menu/:menuId",
//   authenticate,
//   authorizeRoles("MANAGER"),
//   updateMenuItem
// );

// router.delete(
//   "/menu/:menuId",
//   authenticate,
//   authorizeRoles("MANAGER"),
//   deleteMenuItem
// );

// export default router;
