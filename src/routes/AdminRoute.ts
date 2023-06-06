import express from "express";
import {
  AdminLogin,
  GetStudentProfile,
  GetStudentProfiles,
  ApproveStudent,
  CheckSlip,
  DeleteUser,
  AddVideo,
  GetVideos,
  GetVideoByTitle,
  GetVideoById,
  DeleteVideo,
  Counter,
  ResetCounter,
  AddPdf,
  GetAllPdf,
  GetPdfById,
  DeletePdf,
  AddPaper,
  EditVideo,
  AddStudyPack,
  GetAllPaper,
  DeletePaper,
} from "../controllers";
import { Authenticate } from "../middleware";
import {
  DeleteLesson,
  createLesson,
  getAllLessons,
} from "../controllers/LessonController";
import { getStudyPacks } from "../controllers/StudyPackUserController";
import {
  ApproveStudyPack,
  CheckStudyPackSlip,
  DeleteStudyPack,
  EditPaper,
  GetChecked,
  GetPaperById,
  GetStudentPackPayments,
  GetStudentPayments,
} from "../controllers/AdminController";

const router = express.Router();

/*-------------------- Get Counter  ----*/

router.get("/counter", Counter);

/*-------------------- Get Video by Id ----*/

router.get("/reset-counter", ResetCounter);

/* ------------------- Login --------------------- */
router.post("/login", AdminLogin);

router.get("/populate", GetChecked);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/*-------------------- Get All Student details ----*/

router.get("/students", GetStudentProfiles);

/*-------------------- Get All Student details ----*/

router.get("/student-payments/:month", GetStudentPayments);

/*-------------------- Get  Student pack details ----*/

router.get("/student-pack-payments", GetStudentPackPayments);

/*-------------------- Get  Student details ----*/

router.get("/student/:id", GetStudentProfile);

/*-------------------- Approve slip ----*/

router.put("/approve", ApproveStudent);

/*-------------------- check slip ----*/

router.put("/check", CheckSlip);

/*-------------------- Approve Study Pack slip ----*/

router.put("/approve-study-pack", ApproveStudyPack);

/*-------------------- check Study Pack slip ----*/

router.put("/check-study-pack", CheckStudyPackSlip);

/*-------------------- Delete slip ----*/

router.delete("/delete-slip/:id", DeleteUser);

/*-------------------- Add Video ----*/

router.post("/add-video", AddVideo);

/*-------------------- Get All Videos ----*/

router.get("/get-videos", GetVideos);

/*-------------------- Get  Video by title----*/

router.get("/get-video-title/:title", GetVideoByTitle);

/*-------------------- Get Video by Id ----*/

router.get("/get-video/:id", GetVideoById);

/*-------------------- Edit Video by Id ----*/

router.put("/edit-video/:id", EditVideo);

/*-------------------- Delete Video by Id ----*/

router.delete("/delete-video/:id", DeleteVideo);

/*-------------------- create lesson ----*/
router.post("/create-lesson", createLesson);

/*-------------------- create lesson ----*/
router.get("/get-lessons", getAllLessons);

/*-------------------- Delete Lesson by Id ----*/

router.delete("/delete-lesson/:id", DeleteLesson);

/*-------------------- Get All Pdf ----*/

router.get("/get-all-pdf", GetAllPdf);

/*-------------------- Get Pdf by Id ----*/

router.get("/get-pdf/:id", GetPdfById);

/*-------------------- Delete Pdf by Id ----*/

router.delete("/delete-Pdf/:id", DeletePdf);

/*-------------------- Add Paper  ----*/
router.post("/add-paper", AddPaper);

/*-------------------- Add Paper  ----*/
router.get("/get-papers", GetAllPaper);

/*-------------------- Get Paper by Id ----*/
router.get("/get-paper/:id", GetPaperById);

/*-------------------- Edit Video by Id ----*/

router.put("/edit-paper/:id", EditPaper);

/*-------------------- Delete Paper  ----*/
router.delete("/delete-paper/:id", DeletePaper);

/*-------------------- Add Study Pack  ----*/
router.post("/add-studyPack", AddStudyPack);

/*-------------------- Get Study Packs  ----*/
router.get("/get-studyPacks", getStudyPacks);

/*-------------------- Delete Paper  ----*/
router.delete("/delete-studyPack/:id", DeleteStudyPack);

/*-------------------- Add Pdf ----*/

router.post("/add-pdf", AddPdf);

export { router as AdminRoute };
