import { model, Schema } from "mongoose";
import { IDIvision } from "./division.interface";

const divisionSchema = new Schema<IDIvision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);



export const Divison = model<IDIvision>("Divison", divisionSchema);