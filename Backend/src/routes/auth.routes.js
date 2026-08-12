import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Register route
authRouter.post('/register',authController.register);

// Login route
authRouter.post('/login',authController.login)


//Get-me route
authRouter.get("/getme",authController.getMe);

// Refresh route
authRouter.get("/refresh-token",authController.refreshToken);

// Logout route
authRouter.get("/logout", authController.logout);

// LogoutAll route
authRouter.get("/logout-all",authController.logoutAll);

export default authRouter;