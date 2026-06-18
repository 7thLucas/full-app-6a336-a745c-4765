import { CommunityRatingModel } from "../models/community-rating.model";
import { VisitModel } from "../../visits/models/visit.model";

export interface RecommendationResult {
  personal: PersonalRecommendation[];
  community: CommunityRecommendation[];
}

export interface PersonalRecommendation {
  shopName: string;
  city: string;
  country?: string;
  address?: string;
  rating: number;
  lastVisited: Date;
  visitCount: number;
  tastingNotes?: string;
  photoUrl?: string;
}

export interface CommunityRecommendation {
  shopName: string;
  city: string;
  country?: string;
  address?: string;
  averageRating: number;
  ratingCount: number;
}

export const CommunityService = {
  /**
   * Generates recommendations for a city:
   * - Personal: user's own highly-rated visits in that city, sorted by rating
   * - Community: highly-rated shops in that city the user hasn't visited yet
   */
  async getRecommendations(userId: string, city: string): Promise<RecommendationResult> {
    const cityRegex = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    // Personal: user's own visits in the city, grouped by shop, sorted by avg rating
    const personalAgg = await VisitModel.aggregate([
      { $match: { userId, city: { $regex: cityRegex } } },
      {
        $group: {
          _id: "$shopName",
          shopName: { $first: "$shopName" },
          city: { $first: "$city" },
          country: { $first: "$country" },
          address: { $first: "$address" },
          avgRating: { $avg: "$rating" },
          lastVisited: { $max: "$visitedAt" },
          visitCount: { $sum: 1 },
          tastingNotes: { $last: "$tastingNotes" },
          photoUrl: { $last: "$photoUrl" },
        },
      },
      { $sort: { avgRating: -1, lastVisited: -1 } },
      { $limit: 10 },
    ]);

    const personal: PersonalRecommendation[] = personalAgg.map((p) => ({
      shopName: p.shopName,
      city: p.city,
      country: p.country,
      address: p.address,
      rating: Math.round(p.avgRating * 10) / 10,
      lastVisited: p.lastVisited,
      visitCount: p.visitCount,
      tastingNotes: p.tastingNotes,
      photoUrl: p.photoUrl,
    }));

    // Get all shop names the user has visited in this city
    const visitedShopNames = new Set(
      (await VisitModel.find({ userId, city: { $regex: cityRegex } })
        .select("shopName")
        .lean()).map((v) => v.shopName.toLowerCase())
    );

    // Community: top-rated shops in this city the user hasn't visited
    const communityRatings = await CommunityRatingModel.find({
      city: { $regex: cityRegex },
      ratingCount: { $gte: 1 },
    })
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(30)
      .lean();

    const community: CommunityRecommendation[] = communityRatings
      .filter((r) => !visitedShopNames.has(r.shopName.toLowerCase()))
      .slice(0, 10)
      .map((r) => ({
        shopName: r.shopName,
        city: r.city,
        country: r.country,
        address: r.address,
        averageRating: Math.round(r.averageRating * 10) / 10,
        ratingCount: r.ratingCount,
      }));

    return { personal, community };
  },

  async getTopCities(limit = 10) {
    return CommunityRatingModel.aggregate([
      {
        $group: {
          _id: "$city",
          shopCount: { $sum: 1 },
          avgRating: { $avg: "$averageRating" },
        },
      },
      { $sort: { shopCount: -1 } },
      { $limit: limit },
    ]);
  },
};
