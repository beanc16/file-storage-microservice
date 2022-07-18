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


// Validation
const {
    validateGetFilesPayload,
    validateUploadFilesPayload,
} = require("../validation");


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
    validateGetFilesPayload(req.query)
    .then(function (_)
    {
        AppMicroservice.v1.get(_getAppDataFromQuery(req))
        .then(function (result)
        {
            const app = result.data.data[0];
    
            CloudinaryController.get(_getCloudinaryDataFromQuery(req, app))
            .then((result) => _sendCloudinaryGetSuccess(res, result))
            .catch((err) => _sendCloudinaryGetError(res, err));
        })
        .catch((err) => _sendAppMicroserviceError(req, res, err));
    })
    .catch((err) => _sendQueryValidationError(res, err));
});

function _sendCloudinaryGetSuccess(res, result)
{
    Success.json({
        res,
        message: "Successfully retrieved file from Cloudinary",
        data: {
            url: result.url,
        },
    });
}

function _sendCloudinaryGetError(res, err)
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
}





/*********
 * POSTS *
 *********/

app.post("/upload", function(req, res)
{
    validateUploadFilesPayload(req.body)
    .then(function (_)
    {
        AppMicroservice.v1.get(req.body.app)
        .then(function (result)
        {
            const app = result.data.data[0];

            CloudinaryController.upload(_getCloudinaryDataFromBody(req, app))
            .then((result) => _sendCloudinaryUploadSuccess(res, result))
            .catch((err) => _sendCloudinaryUploadError(res, err));
        })
        .catch((err) => _sendAppMicroserviceError(req, res, err));
    })
    .catch((err) => _sendPayloadValidationError(res, err));
});

function _sendCloudinaryUploadSuccess(res, result)
{
    Success.json({
        res,
        message: "Successfully saved file to Cloudinary",
        data: {
            url: result.url,
        },
    });
}

function _sendCloudinaryUploadError(res, err)
{
    InternalServerError.json({
        res,
        message: "Failed to save file to Cloudinary",
        error: err.toJson(),
    });
}





/***********
 * PATCHES *
 ***********/

app.patch("/rename", function(req, res)
{
    AppMicroservice.v1.get(req.body.app)
    .then(function (result)
    {
        const app = result.data.data[0];

        CloudinaryController.rename(_getCloudinaryDataFromBody(req, app))
        .then((result) => _sendCloudinaryRenameSuccess(res, result))
        .catch((err) => _sendCloudinaryRenameError(res, err));
    })
    .catch((err) => _sendAppMicroserviceError(req, res, err));
});

function _sendCloudinaryRenameSuccess(res, result)
{
    Success.json({
        res,
        message: "Successfully renamed file on Cloudinary",
        data: {
            url: result.url,
        },
    });
}

function _sendCloudinaryRenameError(res, err)
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
}





/***********
 * DELETES *
 ***********/

app.delete("/delete", function(req, res)
{
    AppMicroservice.v1.get(req.body.app)
    .then(function (result)
    {
        const app = result.data.data[0];

        CloudinaryController.get(_getCloudinaryDataFromBody(req, app))
        .then(function (getResult)
        {
            CloudinaryController.delete(_getCloudinaryDataFromBody(req, app))
            .then((deleteResult) => _sendCloudinaryDeleteSuccess(res, deleteResult))
            .catch((err) => _sendCloudinaryDeleteError(res, err));
        })
        .catch((err) => _sendCloudinaryGetError(res, err));
    })
    .catch((err) => _sendAppMicroserviceError(req, res, err));
});

function _sendCloudinaryDeleteSuccess(res, result)
{
    Success.json({
        res,
        message: "Successfully deleted file from Cloudinary",
    });
}

function _sendCloudinaryDeleteError(res, err)
{
    InternalServerError.json({
        res,
        message: "Failed to delete file from Cloudinary",
        error: err.toJson(),
    });
}





/***********
 * HELPERS *
 ***********/

function _sendQueryValidationError(res, err)
{
    ValidationError.json({
        res,
        message: "Query Validation Error",
        error: err,
    });
}

function _sendPayloadValidationError(res, err)
{
    ValidationError.json({
        res,
        error: err,
    });
}

function _sendAppMicroserviceError(req, res, err)
{
    const statusCode = (err && err.response && err.response.status)
        ? err.response.status
        : 500;

    if (statusCode === 422)
    {
        ValidationError.json({
            res,
            message: "Invalid appId or appName",
            data: {
                ...req.query,
                appId: req.query.appId || null,
                appName: req.query.appName || null,
            },
            error: err.response.data.error,
        });
    }

    else
    {
        InternalServerError.json({
            res,
            message: "An unknown error occurred while validating appId and appName",
            data: req.query,
            error: err.response.data.error || err,
        });
    }
}

function _getAppDataFromQuery(req)
{
    return {
        id: (req.query.appId) || process.env.FILE_STORAGE_MICROSERVICE_APP_ID || undefined,
        searchName: req.query.appName || undefined,
    };
}

function _getCloudinaryDataFromQuery(req, app)
{
    return {
        ...req.query,
        appId: app._id,
        appName: undefined,
    };
}

function _getCloudinaryDataFromBody(req, app)
{
    return {
        ...req.body,
        app: undefined,
        appId: app._id,
    };
}





module.exports = app;
