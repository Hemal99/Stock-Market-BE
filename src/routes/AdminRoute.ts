import express from "express";
import {
  AddCompany,
  AddStock,
  AdminLogin,
  ChangeStockPrice,
  DeleteCompany,
  DeleteStock,
  GetCompanies,
  GetCompanyById,
  GetStock,
  GetStockForUser,
  GetStudentProfiles,
  UpdateCompany,
  UpdateStock,
} from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();

/* ------------------- Login --------------------- */
router.post("/login", AdminLogin);

/* ------------------- Get Stocks --------------------- */
router.get("/stocks", GetStockForUser);

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

/* ------------------- Add Company --------------------- */
router.post("/add-company", AddCompany);

/* ------------------- Get Companies --------------------- */
router.get("/get-companies", GetCompanies);

/* ------------------- Get Company By Id--------------------- */
router.get("/get-company/:id", GetCompanyById);

/* ------------------- Update Company --------------------- */
router.put("/update-company/:id", UpdateCompany);

/* ------------------- Delete Company --------------------- */
router.delete("/delete-company/:id", DeleteCompany);


export { router as AdminRoute };
