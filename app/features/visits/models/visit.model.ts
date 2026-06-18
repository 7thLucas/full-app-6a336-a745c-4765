import { prop, getModelForClass, modelOptions, index } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: {
    collection: "tbl_visits",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
})
@index({ userId: 1 })
@index({ city: 1 })
@index({ userId: 1, city: 1 })
export class Visit extends TimeStamps {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: String, required: true, trim: true })
  shopName!: string;

  @prop({ type: String, required: true, trim: true })
  city!: string;

  @prop({ type: String, required: false, trim: true })
  country?: string;

  @prop({ type: String, required: false, trim: true })
  address?: string;

  @prop({ type: Number, required: true, min: 1, max: 5 })
  rating!: number;

  @prop({ type: String, required: false })
  tastingNotes?: string;

  @prop({ type: String, required: false })
  photoUrl?: string;

  @prop({ type: Date, required: false })
  visitedAt?: Date;
}

export const VisitModel = getModelForClass(Visit);
