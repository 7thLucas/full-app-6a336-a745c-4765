import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

/**
 * Community ratings — aggregate of all users' visits for a given shop.
 * Maintained as a rolling average: updated whenever a visit is saved.
 */
@modelOptions({
  schemaOptions: {
    collection: "tbl_community_ratings",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
})
@index({ city: 1 })
@index({ shopName: 1, city: 1 }, { unique: true })
export class CommunityRating extends TimeStamps {
  @prop({ type: String, required: true, trim: true })
  shopName!: string;

  @prop({ type: String, required: true, trim: true })
  city!: string;

  @prop({ type: String, required: false, trim: true })
  country?: string;

  @prop({ type: String, required: false, trim: true })
  address?: string;

  @prop({ type: Number, required: true, default: 0 })
  totalRating!: number;

  @prop({ type: Number, required: true, default: 0 })
  ratingCount!: number;

  @prop({ type: Number, required: true, default: 0 })
  averageRating!: number;
}

export const CommunityRatingModel = getModelForClass(CommunityRating);
