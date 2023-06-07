import express, { Request, Response, NextFunction } from "express";
import {
  UserSignUp,
  UserLogin,
  GetVideosByLessonId,
  sendEmailFunc,
  GetPdfsByLessonId,
  UserForgetPassword,
} from "../controllers/UserController";
import { Authenticate } from "../middleware";

const router = express.Router();

/* ------------------- SignUp / Create Customer --------------------- */
router.post("/signup", UserSignUp);

/* ------------------- Login --------------------- */
router.post("/login", UserLogin);

/* ------------------- Forget Password --------------------- */
router.post("/forget-password", UserForgetPassword);

export { router as UserRoute };
