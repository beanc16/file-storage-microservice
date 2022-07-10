/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();





/*******************
 * EXTERNAL ROUTES *
 *******************/

const pingEndpoints = require("./routes/ping");
const filesEndpoints = require("./routes/files");
app.use(`/ping`, pingEndpoints);
app.use(`/files`, filesEndpoints);





module.exports = app;
