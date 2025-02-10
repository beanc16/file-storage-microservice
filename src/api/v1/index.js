/************
 * REQUIRES *
 ************/


// Routing
const express = require("express");
const app = express();





/*******************
 * EXTERNAL ROUTES *
 *******************/

// Public
const publicEndpoints = require("./public");
app.use(`/`, publicEndpoints);





module.exports = app;
