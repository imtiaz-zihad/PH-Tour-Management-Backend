import { IDivision } from "./division.interface";
import { Divison } from "./divison.model";

const createDivision = async (payload: IDivision) => {
  const existingDivision = await Divison.findOne({ name: payload.name });
  if (existingDivision) {
    throw new Error("Division already exists");
  }
  const division = await Divison.create(payload);
  return division;
};



const getAllDivisons = async () => {
  const divisions = await Divison.find();
  const totalDivisions = await Divison.countDocuments();
  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Divison.findById(id);

  if (!existingDivision) {
    throw new Error("Division not found");
  }
  const duplicatedDision = await Divison.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicatedDision) {
    throw new Error("Division name already exists");
  }

  // if (payload.name) {
  //   // const baseSlug = payload.name.toLowerCase().split(" ").join("-");
  //   // let slug = `${baseSlug}-division`;

  //   // let counter = 0;
  //   // while (await Divison.exists({ slug })) {
  //   //   slug = `${baseSlug}-${counter++}`;
  //   // }

  //   // payload.slug = slug;
  // }

  const updateDivision = await Divison.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateDivision;
};

const deleteDivision = async (id: string) => {
  await Divison.findByIdAndDelete(id);
  return null;
};

export const DivisionService = {
  createDivision,
  getAllDivisons,
  updateDivision,
  deleteDivision,
};
