import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import { CommunityController } from "../controllers/community.controller";

const router = Router();

router.get("/api/recommendations", requireAuth, CommunityController.getRecommendations);
router.get("/api/community/top-cities", CommunityController.getTopCities);

export default router;
