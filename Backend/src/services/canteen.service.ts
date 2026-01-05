import { ca } from "zod/locales";
import prisma from "../config/db.js";
import type { CreateCanteenDTO } from "../dtos/canteen.dtos.js";
import type { GetCanteensQueryDTO } from "../dtos/canteen.dtos.js";
import type { UpdateCanteenDTO } from "../dtos/canteen.dtos.js";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../utils/appErrors.js";

// CREATE CANTEEN
export const createCanteen = async (
  data: CreateCanteenDTO,
  currentUser: { id: string; role: string }
) => {
  if (currentUser.role !== "MANAGER") {
    throw new ForbiddenError("Only managers can create canteens");
  }

  const manager =  await prisma.user.findUnique({
    where: { id: data.managerId },
    select: { id: true, role: true },
  });

  if (!manager) {
    throw new NotFoundError("Manager not found");
  }

  if (manager.role !== "MANAGER") {
    throw new BadRequestError("User is not a manager");
  }

  const existing = await prisma.canteen.findFirst({
    where: { managerId: data.managerId },
  });

  if (existing) {
    throw new ConflictError("Manager already owns a canteen");
  }

  return prisma.$transaction(async (tx) => {
    return tx.canteen.create({
      data: {
        name: data.name.trim(),
        location: data.location.trim(),
        managerId: data.managerId,
      },
    });
  });
};

// GET ALL CANTEEN
export const getAllCanteens = async (
  query: GetCanteensQueryDTO = {}
) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  // 1️⃣ Safe pagination limits
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  // 2️⃣ Base filter
  const where: any = {
    isActive: true,
  };

  // 3️⃣ Search support
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  // 4️⃣ Transaction for consistency
  const [canteens, total] = await prisma.$transaction([
    prisma.canteen.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        name: true,
        location: true,
      },
    }),
    prisma.canteen.count({ where }),
  ]);

  // 5️⃣ Return structured response
  return {
    data: canteens,
    meta: {
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  };
};

// GET CANTEEN BY ID
export const getCanteenById = async( canteenId : string) => {
  const canteen = await prisma.canteen.findFirst({
    where : {
      id : canteenId,
      isActive : true
    },
    select : {
      id : true,
      name : true,
      location : true,
      managerId: true,
      createdAt: true,
    },
  });

  if(!canteen){
    throw new NotFoundError("Canteen not found");
  }

  return canteen;
}

// UPDATE CANTEEN
export const updateCanteen = async ( 
  canteenId : string,
    currentUser: { userId: string; role: string },
     data: UpdateCanteenDTO
 ) => {
    if (Object.keys(data).length === 0) {
    throw new BadRequestError("No fields provided for update");
  }

  return prisma.$transaction( async (tx) => {
    const canteen = await tx.canteen.findFirst({
      where : {
        id : canteenId,
        isActive : true
      },
      select : {
        id : true,
        name : true,
        managerId : true
      },
    })

    if(!canteen){
      throw new NotFoundError("Canteen not found");
    }

    if(canteen.managerId !== currentUser.userId || currentUser.role !== "MANAGER"){
       throw new ForbiddenError("Not allowed to update this canteen");
    }

    return tx.canteen.update({
      where: { id: canteenId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.location && { location: data.location.trim() }),
      },
      select: {
        id: true,
        name: true,
        location: true,
        updatedAt: true,
      },
    });
  });
};

// DELETE CANTEEN
export const deleteCanteen = async (
  canteenId: string,
  currentUser: { userId: string; role: string }
) => {
  return prisma.$transaction(async (tx) => {
    const canteen = await tx.canteen.findFirst({
      where: {
        id: canteenId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        managerId: true,
      },
    });

    if (!canteen) {
      throw new NotFoundError("Canteen not found");
    }

    if (
      currentUser.role !== "MANAGER" ||
      canteen.managerId !== currentUser.userId
    ) {
      throw new ForbiddenError("Not allowed to delete this canteen");
    }

    return tx.canteen.update({
      where: { id: canteenId },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
      },
    });
  });
};
