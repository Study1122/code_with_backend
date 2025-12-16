import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

app.use(
    express.json({
        limit: process.env.USE_LIMIT
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: process.env.USE_LIMIT
    })
);
app.use(cookieParser());
app.use(express.static("public"));

//import routes

import userRouter from "./routes/user.routes.js";

//routes declaration

app.use('/api/v1/user', userRouter);

// http://localhost:8000/api/v1/user/register

export { app };

