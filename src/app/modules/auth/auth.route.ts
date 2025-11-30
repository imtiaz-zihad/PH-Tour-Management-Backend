import { AuthControllers } from './auth.controller';
import { Router } from "express";

const router = Router();

router.post("/login",AuthControllers.credentialsLogin);
router.post("/refresh-token",AuthControllers.getNewAccessToken);

export const AuthRoutes = router;