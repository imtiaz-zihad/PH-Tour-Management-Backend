import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Divison.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }

  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as IDivision;
  if (division.name) {
    const baseSlug = division.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Divison.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    division.slug = slug;
  }

  this.setUpdate(division);
  next();
});

export const Divison = model<IDivision>("Divison", divisionSchema);
