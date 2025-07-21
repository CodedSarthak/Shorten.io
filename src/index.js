import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from './config/mongoClient.js';

import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

connectDB();

app.use('/api', authRoutes);
app.use('/api', urlRoutes);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server conntected on PORT : ${PORT}`)
})