import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

router.post("/login", authController.loginController);

export default router;
