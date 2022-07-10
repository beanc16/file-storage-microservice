/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();





/*******************
 * EXTERNAL ROUTES *
 *******************/

// Ping
const pingEndpoints = require("./routes/ping");
app.use(`/ping`, pingEndpoints);





module.exports = app;
