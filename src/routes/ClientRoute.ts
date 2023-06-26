import express from "express";

import { AddLedger, ClientLogin, ClientSignUp } from "../controllers";

import { Authenticate } from "../middleware";

const router = express.Router();

/* ------------------- SignUp / Create Customer --------------------- */
router.post("/signup", ClientSignUp);

/* ------------------- Login --------------------- */
router.post("/login", ClientLogin);


/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Add Ledger --------------------- */
router.post("/add-ledger", AddLedger);

export { router as ClientRoute };
