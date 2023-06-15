import express from "express";
import {
  AdminLogin,
  GetStudentProfiles,
  
} from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();



/* ------------------- Login --------------------- */
router.post("/login", AdminLogin);


/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/*-------------------- Get All Student details ----*/

router.get("/students", GetStudentProfiles);


export { router as AdminRoute };
