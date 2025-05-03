import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { json } from 'express';
import spotRouter from './router/spot.route.js';
import ParkingSpot from './models/parkingspot.js';
import { connectDB } from './lib/db.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/spot', spotRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});