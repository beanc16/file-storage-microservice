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
    NotFound,
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

app.post("/upload", function(req, res)
{
    CloudinaryController.upload({ fileName: "bugcatStareRight.png" })
    .then(function (result)
    {
        Success.json({
            res,
            message: "Successfully saved image to Cloudinary",
            data: {
                url: result.url,
            },
        });
    })
    .catch(function (err)
    {
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

app.patch("/rename", function(req, res)
{
    CloudinaryController.rename({ oldFileName: "bugcatStareRight", newFileName: "bcStareRight" })
    //CloudinaryController.rename({ oldFileName: "bcStareRight", newFileName: "bugcatStareRight" })
    .then(function (result)
    {
        Success.json({
            res,
            message: "Successfully renamed image on Cloudinary",
            data: {
                url: result.url,
            },
        });
    })
    .catch(function (err)
    {
        const { statusCode } = err;

        if (statusCode === 404)
        {
            NotFound.json({
                res,
                message: "That image does not exist on Cloudinary",
                error: err.toJson(),
            });
        }

        else
        {
            InternalServerError.json({
                res,
                message: "Failed to rename image on Cloudinary",
                error: err.toJson(),
            });
        }
    });
});





/***********
 * DELETES *
 ***********/

app.delete("/delete", function(req, res)
{
    CloudinaryController.delete({ fileName: "bugcatStareRight" })
    .then(function (result)
    {
        Success.json({
            res,
            message: "Successfully deleted image from Cloudinary",
        });
    })
    .catch(function (err)
    {
        InternalServerError.json({
            res,
            message: "Failed to delete image from Cloudinary",
            error: err.toJson(),
        });
    });
});





module.exports = app;
