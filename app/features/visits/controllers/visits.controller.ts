import type { Request, Response } from "express";
import { VisitService } from "../services/visit.service";

export const VisitsController = {
  async list(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const cityRaw = req.query.city;
      const city = Array.isArray(cityRaw) ? String(cityRaw[0]) : (typeof cityRaw === "string" ? cityRaw : undefined);
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
      const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;
      const visits = await VisitService.getByUser({
        userId: user.id,
        city,
        limit,
        offset,
      });
      res.json({ success: true, data: visits });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { shopName, city, country, address, rating, tastingNotes, photoUrl, visitedAt } = req.body;

      if (!shopName || !city || !rating) {
        return res.status(400).json({ success: false, error: "shopName, city, and rating are required" });
      }

      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
      }

      const visit = await VisitService.create({
        userId: user.id,
        shopName: String(shopName).trim(),
        city: String(city).trim(),
        country: country ? String(country).trim() : undefined,
        address: address ? String(address).trim() : undefined,
        rating: ratingNum,
        tastingNotes: tastingNotes ? String(tastingNotes).trim() : undefined,
        photoUrl: photoUrl ? String(photoUrl).trim() : undefined,
        visitedAt: visitedAt ? new Date(visitedAt) : new Date(),
      });

      res.status(201).json({ success: true, data: visit });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const visit = await VisitService.getById(String(req.params.id), user.id);
      if (!visit) return res.status(404).json({ success: false, error: "Visit not found" });
      res.json({ success: true, data: visit });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const deleted = await VisitService.deleteVisit(String(req.params.id), user.id);
      if (!deleted) return res.status(404).json({ success: false, error: "Visit not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getCities(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const cities = await VisitService.getCitySummary(user.id);
      res.json({ success: true, data: cities });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getGrouped(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const grouped = await VisitService.getGroupedByCity(user.id);
      res.json({ success: true, data: grouped });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
