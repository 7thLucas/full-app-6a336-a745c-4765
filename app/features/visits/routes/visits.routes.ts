import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import { VisitsController } from "../controllers/visits.controller";

const router = Router();

// All visit routes require authentication
router.get("/api/visits", requireAuth, VisitsController.list);
router.post("/api/visits", requireAuth, VisitsController.create);
router.get("/api/visits/cities", requireAuth, VisitsController.getCities);
router.get("/api/visits/grouped", requireAuth, VisitsController.getGrouped);
router.get("/api/visits/:id", requireAuth, VisitsController.getById);
router.delete("/api/visits/:id", requireAuth, VisitsController.remove);

export default router;
