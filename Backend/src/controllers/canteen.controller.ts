import type { Request, Response, NextFunction } from "express";
import * as CanteenService from "../services/canteen.service.js";
import { BadRequestError } from "../utils/appErrors.js";

export const createCanteen = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const canteen = await CanteenService.createCanteen(
            {
                name: req.body.name,
                location: req.body.location,
                managerId: req.user!.userId,
            },
            { id: req.user!.userId, role: req.user!.role } // pass current user for auth checks
        );

        res.status(201).json({ success: true, message: "Canteen created successfully", data: canteen })
    } catch (error) {
        next(error);
    }
}

export const getAllCanteens = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await CanteenService.getAllCanteens(req.query);
        return res.json(200).json({ success: true, ...result })
    } catch (error) {
        next(error);
    }
}

export const getCanteenById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const canteenId = req.params.id;

    if (!canteenId) {
      throw new BadRequestError("Canteen id is required");
    }

    const canteen = await CanteenService.getCanteenById(canteenId);

    res.status(200).json({
      success: true,
      data: canteen,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCanteen = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const canteenId = req.params.id;
    if (!canteenId) {
      throw new BadRequestError("Canteen id is required");
    }

    const result = await CanteenService.deleteCanteen(
      canteenId,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCanteen = async (req : Request, res : Response, next : NextFunction) => {
  try {
    const canteenId = req.params.id;
    if (!canteenId) {
      throw new BadRequestError("Canteen id is required");
    }

    const updated = await CanteenService.updateCanteen(
      canteenId,
      req.user!,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
