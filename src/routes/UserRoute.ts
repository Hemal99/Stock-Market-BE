import express, { Request, Response, NextFunction } from "express";
import {
  UserSignUp,
  UserLogin,
  UserForgetPassword,
  GetCompaniesForUser,
} from "../controllers/UserController";


const router = express.Router();

/* ------------------- SignUp / Create Customer --------------------- */
router.post("/signup", UserSignUp);

/* ------------------- Login --------------------- */
router.post("/login", UserLogin);

/* ------------------- Forget Password --------------------- */
router.post("/forget-password", UserForgetPassword);

/*------------------- Get Company ---------------------*/
router.get("/get-companies", GetCompaniesForUser)

export { router as UserRoute };
