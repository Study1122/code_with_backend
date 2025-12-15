import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({
  limit: process.env.USE_LIMIT
}))

app.use(express.urlencoded({
  extended: true,
  limit: process.env.USE_LIMIT
}))

app.use(cookieParser())



app.use(express.static("public"))



export {app}