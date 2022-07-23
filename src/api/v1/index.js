/************
 * REQUIRES *
 ************/


// Routing
const express = require("express");
const app = express();

// Telemetry
const { express: { errorHandler } } = require("@beanc16/logger");





/*******************
 * EXTERNAL ROUTES *
 *******************/

// Public
const publicEndpoints = require("./public");
app.use(`/`, publicEndpoints);

// Private
const privateEndpoints = require("./private");
app.use(`/private`, privateEndpoints);





/********************
 * ERROR MIDDLEWARE *
 ********************/

app.use((err, req, res, next) => errorHandler(err, req, res, next));





module.exports = app;
