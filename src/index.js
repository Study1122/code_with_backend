//require('dotenv').config({path: './env'});
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import connectDB from "./db/index.js";

const app = express();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log("ERROR: MongoDB connection failed!!!", err);
    });

/*

//different approche for connection with database

import mongoose require('mongoose');
import { DB_NAME } from './constants';
import express from 'express';
const app = express();


(async ()=>{ //asynchronus process
  try{       //try for connection
    await mongoose.connect(`${process.env.MONGODB_URI}`/${DB_NAME})
    app.on("error", (error)=>{ //check error during connection of app with server
      console.log("ERROR: ", error)
      throw error
    })
    
    app.listen(process.env.PORT, ()=>{ // if connectio is succesfull
      console.log(`serve is running on port ${process.env.PORT}`);
    })
  }catch(err){ //catching error
    console.log("ERROR: ", err);
    throw err
  }
})()

*/
