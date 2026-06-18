import type { Request, Response } from "express";
import { CommunityService } from "../services/community.service";

export const CommunityController = {
  async getRecommendations(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { city } = req.query;
      if (!city) {
        return res.status(400).json({ success: false, error: "city query parameter is required" });
      }
      const results = await CommunityService.getRecommendations(user.id, String(city));
      res.json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getTopCities(_req: Request, res: Response) {
    try {
      const cities = await CommunityService.getTopCities(10);
      res.json({ success: true, data: cities });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
