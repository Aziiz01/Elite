import { Router } from "express";
import { subscribe, list, send } from "../controllers/newsletterController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

router.post("/subscribe", subscribe);
router.get("/subscribers", adminAuth, list);
router.post("/send", adminAuth, send);

export default router;
