import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = async (req,res,next)=>{
    try{
        if(!req.headers.authorization){
            return res.send({
                success:false,
                message:'Access Denied, Token Required'
            })
        }
        const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user=decode;
        // console.log(decode);
        next();
    }
    catch(error){
        return res.send({
            success:false,
            message:'User Access Denied, Invalid Token',
            error:error.message
        })
    }
}

export const isAdmin = async (req,res,next)=>{
    try{
        const user= await userModel.findById(req.user._id);
        if(!user){
            return res.send({
                success:false,
                message:'Admin Access Denied'
            })
        }
        // console.log(user)
        if(user.role!==1){
            return res.status(201).send({
                success:false,
                message:'Unauthorized Access'
            })
        }
        else{
            next();
        }
    }
    catch(error){
        return res.send({
            success:false,
            message:'Admin Access Denied',
            error: error.message
        })
    }
}