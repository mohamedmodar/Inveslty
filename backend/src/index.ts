import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
const app = express();

app.use(cors({
  origin: 'http://localhost:9000',
  credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(9000, ()=>{
    console.log("server running on http://localhost:9000/")
})

const MONGO_URL = "mongodb+srv://modar:modar5@cluster0.kt0s4qp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

mongoose.connection.once('open', () => {
  console.log('Successfully connected to MongoDB!');
  
});

app.use('/', router());