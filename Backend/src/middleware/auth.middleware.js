import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/users.model.js";
import sessionModel from "../models/session.model.js";

export async function authenticate(req, res, next){
    const authHeader = req.headers.authorization;


    if(!authHeader|| !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            message : "Access token is required"
        });

    }
    const accessToken = authHeader.split(" ")[1];
    
    let decoded;
    try {
        decoded = jwt.verify(accessToken,config.JWT_SECRET);
        
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired access token"
        })
        
    }

    const session = await sessionModel.findOne({_id : decoded.sessionId ,user: decoded.id, revoked : false});
    if(!session){
        return res.status(401).json({
            "message":"session has expired or user is logged out"
        })
    }

    const user = await userModel.findById(decoded.id);
    if(!user){
        return res.status(401).json({
            "message":"user not found"
        })
    }

    req.user = user;
    req.session = session;

    next();
}