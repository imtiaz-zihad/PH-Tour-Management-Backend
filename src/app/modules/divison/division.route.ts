
import { Router } from "express";
import { router } from "../../routes";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
    createDivisionSchema,
    updateDivisionSchema
}  from "./division.validation"
import { DivisionController } from "./division.controller";

const route = Router();

router.post("/create",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);

router.get("/",
    DivisionController.getAllDivisions
);

route.patch("/:id",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);

route.delete("/:id",
    checkAuth(Role.SUPER_ADMIN,Role.ADMIN),
    DivisionController.deleteDivision
);


export const DivisionRoutes = route;