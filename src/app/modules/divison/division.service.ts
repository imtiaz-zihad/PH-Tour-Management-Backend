import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
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

const getSingleDivison = async (slug: string) => {
  const division = await Divison.findOne({ slug });

  return {
    data: division,
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


    const updatedDivision = await Divison.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    if (payload.thumbnail && existingDivision.thumbnail) {
        await deleteImageFromCLoudinary(existingDivision.thumbnail)
    }
  return updatedDivision;
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
  getSingleDivison,
};
