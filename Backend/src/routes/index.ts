import { Router } from "express";
import authRoutes from "./auth.routes.js"
import canteenRoutes from "./canteen.routes.js"
import menuRoutes from "./menu.routes.js"
// import menuRoutes from "./menu.routes.js"


const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Canteen API is running 🍔" });
});

router.use("/auth", authRoutes);
router.use("/canteens", canteenRoutes);
router.use("/menus", menuRoutes);

export default router;
