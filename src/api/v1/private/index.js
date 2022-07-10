/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();





/**************
 * MIDDLEWARE *
 **************/

app.use("/", function(req, res, next)
{
    // TODO: Add validation to make endpoints private here
    next();
});





/*******************
 * EXTERNAL ROUTES *
 *******************/

// labelHere
//const myEndpoints = require("./routes/myEndpoints");
//app.use(`/`, myEndpoints);





module.exports = app;
