import { Router } from "express";
import usersController from "../controllers/usersController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, usersController.getUsers);
router.post("/save-user", requireAuth, usersController.saveUser);
export default router;
