import express from "express";
import {
  LoginStudypackUser,
  addStudyPackPayment,
  getMyStudyPacks,
  getStudyPacks,
  registerStudypackUser,
} from "../controllers/StudyPackUserController";

const router = express.Router();

/* ------------------- SignUp / Create Customer --------------------- */
router.post("/signup", registerStudypackUser);

/* ------------------- Login --------------------- */
router.post("/login", LoginStudypackUser);

/* ------------------- get study Packs --------------------- */
router.get("/get-study-packs", getStudyPacks);

/* ------------------- get study Packs --------------------- */
router.get("/get-mystudy-packs", getMyStudyPacks);

/* ------------------- add study Packs payment--------------------- */
router.post("/add-study-packs-payment",addStudyPackPayment);

export { router as StudyPackUserRoute };
