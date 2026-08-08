import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const testRouter = Router();
testRouter.get('/me',authenticate , (req,res)=>{
    res.status(200).json({
        messsage:"Authentication successfully",
        user: req.user,
        session : req.session
    });
});

export default testRouter