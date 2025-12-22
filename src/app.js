import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: process.env.USE_LIMIT,
  })
);

app.use(
  express.urlencoded(
    {
      extended: true,
      limit: process.env.USE_LIMIT,
    },
    { extended: true }
  )
);
app.use(cookieParser());
app.use(express.static("public"));

//import routes

import userRouter from "./routes/user.routes.js";

//routes declaration
app.get("/", (req, res) => {
  res.send("server is online!!!");
});

//without asyncHandler 
/*
app.get("/login", async (req, res, next)=>{
  try{
    const user = await User.findOne();
    res.json(user);
  }catch(err){
    next(err);
  }
});

//with asynHandler

app.get("/login",
  asyncHandler(async (req, res) => {
    const user = await User.findOne();
    res.json(user);
  })
);

*/

app.use("/api/v1/user", userRouter);

// http://localhost:8000/api/v1/user/register

export { app };
