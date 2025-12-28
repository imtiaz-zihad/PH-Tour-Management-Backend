import { Router } from "express";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { DivisionController } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

const route = Router();

route.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionSchema),
  DivisionController.createDivision
);

route.get("/", DivisionController.getAllDivisions);
route.get("/:slug", DivisionController.getSingleDivision);

route.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionSchema),
  DivisionController.updateDivision
);

route.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  DivisionController.deleteDivision
);

export const DivisionRoutes = route;
