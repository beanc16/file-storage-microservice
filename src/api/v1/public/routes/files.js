/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();


// Access req.body in post requests
const bodyParser = require("body-parser");
app.use(bodyParser.json());                         // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// Controllers
const { CloudinaryController } = require("../../../../js/controllers");


// Response
const { Success } = require("dotnet-responses");





/********
 * GETS *
 ********/

/*
app.get("/", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});
*/





/*********
 * POSTS *
 *********/

app.post("/", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});





/***********
 * PATCHES *
 ***********/

/*
app.patch("/", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});
*/





/***********
 * DELETES *
 ***********/

/*
app.delete("/", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});
*/





module.exports = app;
