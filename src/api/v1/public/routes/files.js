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
const {
    Success,
    InternalServerError,
} = require("dotnet-responses");





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

app.post("/single", function(req, res)
{
    CloudinaryController.upload({ fileName: "bugcatStareRight.png" })
    .then(function (result)
    {
        Success.json({
            res,
            message: "Success!",
            data: {
                url: result.url,
            },
        });
    })
    .catch(function (err)
    {
        console.log("err:", err);
        InternalServerError.json({
            res,
            message: "Failed to save image to Cloudinary",
            error: err.toJson(),
        });
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
