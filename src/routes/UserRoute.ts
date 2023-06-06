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
import {
  getChemistryLessons,
  getPhysicsLessons,
} from "../controllers/LessonController";
import {
  createOrupdateWatchTime,
  getWatchTimeByVideoId,
} from "../controllers/WatchTimeController";
import {
  addPayment,
  getPaymentByUserId,
} from "../controllers/PaymentController";

const router = express.Router();

/* ------------------- SignUp / Create Customer --------------------- */
router.post("/signup", UserSignUp);

/* ------------------- Login --------------------- */
router.post("/login", UserLogin);

/* ------------------- Forget Password --------------------- */
router.post("/forget-password", UserForgetPassword);

/* ------------------- get chemistry lessons --------------------- */
router.get("/chemistry-lessons", getChemistryLessons);

/* ------------------- get physics lessons --------------------- */
router.get("/physics-lessons", getPhysicsLessons);

/* ------------------- get vedios by lesson id --------------------- */
router.get("/get-vedios/:lessonId/:userId", GetVideosByLessonId);

/* ------------------- create or update watch time --------------------- */
router.post("/create-or-update-watch-time", createOrupdateWatchTime);

/* ------------------- get watch time by video id --------------------- */
router.get("/get-watch-time/:videoId/:userId", getWatchTimeByVideoId);

/* -----------------send email --------------------- */
router.post("/send-email", sendEmailFunc);

/* ------------------- add payment --------------------- */
router.post("/add-payment", addPayment);

/* ------------------- get payment --------------------- */
router.get("/get-payment/:userId", getPaymentByUserId);

/* ------------------- get pdf --------------------- */
router.get("/get-pdf/:lessonId", GetPdfsByLessonId);



export { router as UserRoute };
