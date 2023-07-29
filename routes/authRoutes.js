import express from 'express';

import { registerController, loginController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController, getUserController } from "../controllers/authController.js"

import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

//router object
const authRoutes = express.Router();

//Register api || Method POST
authRoutes.post('/register',registerController);

//Login api || Method POST
authRoutes.post('/login',loginController);

// Forgot Password || Method POST
authRoutes.post('/forgot-password',forgotPasswordController);

// protected user routh auth
authRoutes.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

// protected admin routh auth
authRoutes.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

// update profile
authRoutes.put('/profile',requireSignIn, updateProfileController);

// orders
authRoutes.get('/orders',requireSignIn, getOrdersController);

// all orders
authRoutes.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// order status update
authRoutes.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

// get all users
authRoutes.get("/user-list",requireSignIn,isAdmin, getUserController);


export default authRoutes;