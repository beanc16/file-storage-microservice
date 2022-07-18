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


// Microservices
const { AppMicroservice } = require("@beanc16/microservices-abstraction");


// Controllers
const { CloudinaryController } = require("../../../../js/controllers");


// Response
const {
    Success,
    NotFound,
    ValidationError,
    InternalServerError,
} = require("dotnet-responses");





/********
 * GETS *
 ********/

app.get("/", function(req, res)
{
    AppMicroservice.v1.get({
        id: (req.query.appId) || process.env.FILE_STORAGE_MICROSERVICE_APP_ID || undefined,
        searchName: req.query.appName || undefined,
    })
    .then(function (result)
    {
        const app = result.data.data[0];
        CloudinaryController.get({
            ...req.query,
            appId: app._id,
            appName: app.searchName,
        })
        .then(function (result)
        {
            Success.json({
                res,
                message: "Successfully retrieved file from Cloudinary",
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
                    message: "That file does not exist on Cloudinary",
                    error: err.toJson(),
                });
            }

            else
            {
                InternalServerError.json({
                    res,
                    message: "Failed to retrieve file from Cloudinary",
                    error: err.toJson(),
                });
            }
        });
    })
    .catch(function (err)
    {
        const statusCode = (err && err.response && err.response.status)
            ? err.response.status
            : 500;

        if (statusCode === 422)
        {
            ValidationError.json({
                res,
                message: "Invalid appName",
                data: {
                    ...req.query,
                    appName: req.query.appName || null,
                },
                error: err.response.data.error,
            });
        }

        else
        {
            InternalServerError.json({
                res,
                message: "An unknown error occurred while validating appName",
                data: req.query,
                error: err.response.data.error || err,
            });
        }
    });
});





/*********
 * POSTS *
 *********/

app.post("/upload", function(req, res)
{
    CloudinaryController.upload(req.body)
    .then(function (result)
    {
        Success.json({
            res,
            message: "Successfully saved file to Cloudinary",
            data: {
                url: result.url,
            },
        });
    })
    .catch(function (err)
    {
        InternalServerError.json({
            res,
            message: "Failed to save file to Cloudinary",
            error: err.toJson(),
        });
    });
});





/***********
 * PATCHES *
 ***********/

app.patch("/rename", function(req, res)
{
    CloudinaryController.rename(req.body)
    .then(function (result)
    {
        Success.json({
            res,
            message: "Successfully renamed file on Cloudinary",
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
                message: "That file does not exist on Cloudinary",
                error: err.toJson(),
            });
        }

        else
        {
            InternalServerError.json({
                res,
                message: "Failed to rename file on Cloudinary",
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
    CloudinaryController.delete(req.body)
    .then(function (result)
    {
        Success.json({
            res,
            message: "Successfully deleted file from Cloudinary",
        });
    })
    .catch(function (err)
    {
        InternalServerError.json({
            res,
            message: "Failed to delete file from Cloudinary",
            error: err.toJson(),
        });
    });
});





module.exports = app;
