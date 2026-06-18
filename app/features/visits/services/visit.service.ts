import { VisitModel } from "../models/visit.model";
import { CommunityRatingModel } from "../../community/models/community-rating.model";

export interface CreateVisitInput {
  userId: string;
  shopName: string;
  city: string;
  country?: string;
  address?: string;
  rating: number;
  tastingNotes?: string;
  photoUrl?: string;
  visitedAt?: Date;
}

export interface VisitFilters {
  userId: string;
  city?: string;
  limit?: number;
  offset?: number;
}

export const VisitService = {
  async create(input: CreateVisitInput) {
    const visit = await VisitModel.create({
      ...input,
      visitedAt: input.visitedAt ?? new Date(),
    });

    // Update community rating
    await CommunityRatingModel.findOneAndUpdate(
      { shopName: input.shopName, city: input.city },
      {
        $inc: { totalRating: input.rating, ratingCount: 1 },
        $set: {
          country: input.country,
          address: input.address,
        },
        $setOnInsert: { shopName: input.shopName, city: input.city },
      },
      { upsert: true, new: true }
    ).then(async (doc) => {
      if (doc) {
        doc.averageRating = doc.ratingCount > 0 ? doc.totalRating / doc.ratingCount : 0;
        await doc.save();
      }
    });

    return visit;
  },

  async getByUser(filters: VisitFilters) {
    const query: Record<string, unknown> = { userId: filters.userId };
    if (filters.city) query.city = { $regex: new RegExp(`^${filters.city}$`, "i") };

    return VisitModel.find(query)
      .sort({ visitedAt: -1 })
      .skip(filters.offset ?? 0)
      .limit(filters.limit ?? 50)
      .lean();
  },

  async getById(id: string, userId: string) {
    return VisitModel.findOne({ _id: id, userId }).lean();
  },

  async deleteVisit(id: string, userId: string) {
    return VisitModel.findOneAndDelete({ _id: id, userId });
  },

  /** Returns all unique cities a user has visited, with visit counts */
  async getCitySummary(userId: string) {
    return VisitModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
          lastVisited: { $max: "$visitedAt" },
          avgRating: { $avg: "$rating" },
          country: { $first: "$country" },
        },
      },
      { $sort: { lastVisited: -1 } },
    ]);
  },

  /** Returns visits grouped by city for the city history browser */
  async getGroupedByCity(userId: string) {
    const visits = await VisitModel.find({ userId })
      .sort({ visitedAt: -1 })
      .lean();

    const groups: Record<string, typeof visits> = {};
    for (const visit of visits) {
      const key = visit.city;
      if (!groups[key]) groups[key] = [];
      groups[key].push(visit);
    }

    return groups;
  },

  async countByUser(userId: string) {
    return VisitModel.countDocuments({ userId });
  },
};
