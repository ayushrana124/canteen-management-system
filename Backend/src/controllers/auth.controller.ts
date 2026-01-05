import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js"

export const register = async (req: Request, res: Response) => {
   try{
    const userData = req.body;
    const user = await AuthService.registerUser(userData);
     res.status(201).json({ message: "User registered successfully", user });
   }catch(err : any){
    res.status(400).json({ message: err.message });
   }
}

export const login = async (req: Request, res : Response) => {
    try{
  const userData = req.body;
  const { accessToken, refreshToken, user }  = await AuthService.loginUser(userData);
  res.status(200).json({message : "User login successfully", user, accessToken, refreshToken})
    }catch(err : any){
        res.status(400).json({message : err.message});
    }
}