

const express = require("express");
const cors=require("cors");

const app=express();
app.use(cors());
app.use(express.json()); //cors need to be put before router
const mainRouter=require('./routes/index');



app.use("/api/v1",mainRouter);// this is used to route that starts with api/v1 and another rute




app.listen("3000");


