import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// --- Apartment Price Prediction Route ---
// This route acts as a proxy to the Python FastAPI microservice
app.post('/predict-apartment', async (req, res) => {
  try {
    // The FastAPI service is expected to be running on localhost:8000
    const fastApiUrl = 'http://127.0.0.1:8000/predict';

    // Forward the request body to the FastAPI service
    const response = await axios.post(fastApiUrl, req.body);

    // Send the prediction from the FastAPI service back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error calling prediction service:', error.message);
    
    // Check if the error is from Axios (e.g., service is down)
    if (error.response) {
      // Forward the error status and data from the FastAPI service
      res.status(error.response.status).json(error.response.data);
    } else {
      // Generic error if the service is unreachable
      res.status(503).json({ detail: 'The prediction service is currently unavailable.' });
    }
  }
});

app.use('/', router());

const server = http.createServer(app);

// MongoDB connection setup
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_CLUSTER_URL = process.env.MONGO_CLUSTER_URL;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

// Validate required environment variables
if (!MONGO_USERNAME || !MONGO_PASSWORD || !MONGO_CLUSTER_URL || !MONGO_DATABASE) {
    console.error('Missing required MongoDB environment variables. Please check your .env file.');
    process.exit(1);
}

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER_URL}/${MONGO_DATABASE}?retryWrites=true&w=majority`;

mongoose.Promise = Promise;

console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        server.listen(9000, ()=>{
            console.log("Server running on http://localhost:9000/")
        })
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });