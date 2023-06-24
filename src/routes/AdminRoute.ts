import express from "express";
import {
  AddStock,
  AdminLogin,
  ChangeStockPrice,
  DeleteStock,
  GetStock,
  GetStudentProfiles,
  UpdateStock,
} from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();

/* ------------------- Login --------------------- */
router.post("/login", AdminLogin);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Add Stock --------------------- */
router.post("/add-stock", AddStock);

/* ------------------- Get Stocks --------------------- */
router.get("/get-stocks", GetStock);

/* ------------------- Change Stock Price --------------------- */
router.put("/change-stock-price/:id", ChangeStockPrice);

/* ------------------- Update Stock --------------------- */
router.put("/update-stock/:id", UpdateStock);

/* ------------------- Delete Stock --------------------- */
router.delete("/delete-stock/:id", DeleteStock);

export { router as AdminRoute };
