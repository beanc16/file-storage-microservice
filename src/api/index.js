/************
 * REQUIRES *
 ************/


// Routing
const express = require("express");
const app = express();


// Custom variables
const v1 = "v1";





/*******************
 * EXTERNAL ROUTES *
 *******************/

// Version 1
const v1Endpoints = require("./v1");
app.use(`/${v1}`, v1Endpoints);





module.exports = app;
