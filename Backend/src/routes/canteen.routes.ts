import { Router } from "express";
import {
  createCanteen,
  getAllCanteens,
  getCanteenById,
  updateCanteen,
  deleteCanteen
} from "../controllers/canteen.controller.js";

import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// STUDENT + MANAGER
router.get("/", authenticate, getAllCanteens);
router.get("/:id", authenticate, getCanteenById);

// MANAGER only
router.post("/", authenticate, authorizeRoles("MANAGER"), createCanteen);
router.patch("update/:id", authenticate, authorizeRoles("MANAGER"), updateCanteen);
router.patch("/delete/:id", authenticate, authorizeRoles("MANAGER"), deleteCanteen);

export default router;
