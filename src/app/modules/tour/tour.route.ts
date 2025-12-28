import express from "express";
import { TourController } from './tour.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middleware/validateRequest';
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from './tour.validation';
const router = express.Router();


/* ----------------Tour Type Routes----------------*/


router.get("/tour-types", TourController.getAllTourTypes);
router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.updateTourType
);

router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType);

/* --------------------- TOUR ROUTES ---------------------- */
router.get("/", TourController.getAllTours);

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourZodSchema),
    TourController.createTour
);

router.get("/:id", TourController.getSingleTour);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourController.updateTour
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour);

export const TourRoutes = router;