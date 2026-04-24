import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect=async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token=req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({success:false,message:'Not authorized, no token, please login'});
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id).select('-password');
        next();
    }
    catch(error){
        res.status(401).json({success:false,message:'Not authorized, token failed, or token expired, please login again'});
    }
}

export const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false,message:'Forbidden, you do not have permission to access this resource'});
        }
        next();
    }
}