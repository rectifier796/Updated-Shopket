import express from 'express';
import colors  from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { isAdmin, requireSignIn } from './middlewares/authMiddleware.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app=express();

//database connection
connectDB();

//middlewares
app.use(cors());
app.use(express.json());  //enabling sending of json data
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

//Routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

app.get('/',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        message:"Welcome"
    })
});

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
})