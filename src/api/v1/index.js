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

// Private
const privateEndpoints = require("./private");
app.use(`/private`, privateEndpoints);





module.exports = app;
