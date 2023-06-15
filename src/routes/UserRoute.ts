import express, { Request, Response, NextFunction } from "express";
import {
  UserSignUp,
  UserLogin,
  UserForgetPassword,
} from "../controllers/UserController";


const router = express.Router();

/* ------------------- SignUp / Create Customer --------------------- */
router.post("/signup", UserSignUp);

/* ------------------- Login --------------------- */
router.post("/login", UserLogin);

/* ------------------- Forget Password --------------------- */
router.post("/forget-password", UserForgetPassword);

export { router as UserRoute };
