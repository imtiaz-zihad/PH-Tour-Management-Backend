import passport from 'passport';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { AuthControllers } from './auth.controller';
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post("/login",AuthControllers.credentialsLogin);
router.post("/refresh-token",AuthControllers.getNewAccessToken);
router.post("/logout",AuthControllers.logout);
router.post("/reset-password",checkAuth(...Object.values(Role)),AuthControllers.resetPassword);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google", async(req: Request,res: Response, next: NextFunction) =>{
    const redirect = req.query.redirect || "/" as string;
    passport.authenticate("google", {scope: ["profile","email"],state: redirect as string}) (req,res, next);
})

router.get("/google/callback",passport.authenticate("google",{failureRedirect: "/login"}), AuthControllers.googleCallbackController) 


export const AuthRoutes = router;