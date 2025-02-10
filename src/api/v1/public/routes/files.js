/** **********
 * REQUIRES *
 *********** */

// Routing
const express = require('express');

const app = express();

// Access req.body in post requests
const bodyParser = require('body-parser');

app.use(bodyParser.json());                         // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded

// Telemetry
const { logger } = require('@beanc16/logger');

// Microservices
const { AppMicroservice } = require('@beanc16/microservices-abstraction');

// Controllers
const {
    Success,
    NotFound,
    ValidationError,
    InternalServerError,
} = require('dotnet-responses');
const { CloudinaryController } = require('../../../../js/controllers/index.js');

// Validation
const {
    validateGetFilesPayload,
    validateUploadFilesPayload,
    validateRenameFilesPayload,
    validateDeleteFilesPayload,
    validateDeleteBulkPayload,
} = require('../validation/index.js');

// Response

/** ******
 * GETS *
 ******* */

app.get('/', (req, res) =>
{
    validateGetFilesPayload(req.query)
        .then((/* _ */) =>
        {
            AppMicroservice.v1.get(_getAppDataFromQuery(req))
                .then((appResult) =>
                {
                    const appData = appResult.data.data[0];
                    const cloudinaryData = _getCloudinaryDataFromQuery(req, appData);

                    CloudinaryController.get(cloudinaryData)
                        .then((cloudinaryResult) =>
                        {
                            const {
                                query: {
                                    imageOptions,
                                },
                            } = req;

                            if (!imageOptions)
                            {
                                return _sendCloudinaryGetSuccess(res, cloudinaryResult);
                            }

                            const fileExtension = CloudinaryController.getExtensionFromUrl(cloudinaryResult.url);

                            CloudinaryController.doImageOperation({
                                ...cloudinaryData,
                                file: {
                                    fileName: cloudinaryData.fileName,
                                    fileExtension,
                                },
                                options: imageOptions,
                            })
                                .then((upscaledUrl) => _sendCloudinaryGetSuccess(res, {
                                    url: upscaledUrl,
                                }))
                                .catch((err) => _sendCloudinaryGetError(res, err));
                        })
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
        message: 'Successfully retrieved file from Cloudinary',
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
            message: 'That file does not exist on Cloudinary',
            error: err.toJson(),
        });
    }

    else
    {
        const errMsg = 'Failed to retrieve file from Cloudinary';
        logger.error(errMsg, err);

        InternalServerError.json({
            res,
            message: errMsg,
            error: err.toJson(),
        });
    }
}

/** *******
 * POSTS *
 ******** */

app.post('/upload', (req, res) =>
{
    validateUploadFilesPayload(req.body)
        .then((/* _ */) =>
        {
            AppMicroservice.v1.get(req.body.app)
                .then((appResult) =>
                {
                    const appData = appResult.data.data[0];
                    const cloudinaryData = _getCloudinaryDataFromBody(req, appData);

                    CloudinaryController.upload(cloudinaryData)
                        .then((cloudinaryResult) =>
                        {
                            const {
                                body: {
                                    imageOptions,
                                },
                            } = req;

                            if (!imageOptions)
                            {
                                return _sendCloudinaryUploadSuccess(res, cloudinaryResult);
                            }

                            const fileExtension = CloudinaryController.getExtensionFromUrl(cloudinaryResult.url);

                            CloudinaryController.doImageOperation({
                                ...cloudinaryData,
                                file: {
                                    ...cloudinaryData.file,
                                    fileExtension,
                                },
                                options: imageOptions,
                            })
                                .then((upscaledUrl) => _sendCloudinaryUploadSuccess(res, {
                                    url: upscaledUrl,
                                }))
                                .catch((err) => _sendCloudinaryUploadError(res, err));
                        })
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
        message: 'Successfully saved file to Cloudinary',
        data: {
            url: result.url,
        },
    });
}

function _sendCloudinaryUploadError(res, err)
{
    const errMsg = 'Failed to save file to Cloudinary';
    logger.error(errMsg, err);

    InternalServerError.json({
        res,
        message: errMsg,
        error: err.toJson(),
    });
}

/** *********
 * PATCHES *
 ********** */

app.patch('/rename', (req, res) =>
{
    validateRenameFilesPayload(req.body)
        .then((/* _ */) =>
        {
            AppMicroservice.v1.get(req.body.app)
                .then((appResult) =>
                {
                    const appData = appResult.data.data[0];

                    CloudinaryController.rename(_getCloudinaryDataFromBody(req, appData))
                        .then((result) => _sendCloudinaryRenameSuccess(res, result))
                        .catch((err) => _sendCloudinaryRenameError(res, err));
                })
                .catch((err) => _sendAppMicroserviceError(req, res, err));
        })
        .catch((err) => _sendPayloadValidationError(res, err));
});

function _sendCloudinaryRenameSuccess(res, result)
{
    Success.json({
        res,
        message: 'Successfully renamed file on Cloudinary',
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
            message: 'That file does not exist on Cloudinary',
            error: err.toJson(),
        });
    }

    else
    {
        const errMsg = 'Failed to rename file on Cloudinary';
        logger.error(errMsg, err);
    
        InternalServerError.json({
            res,
            message: errMsg,
            error: err.toJson(),
        });
    }
}

/** *********
 * DELETES *
 ********** */

app.delete('/delete', (req, res) =>
{
    validateDeleteFilesPayload(req.body)
        .then((/* _ */) =>
        {
            AppMicroservice.v1.get(req.body.app)
                .then((appResult) =>
                {
                    const appData = appResult.data.data[0];

                    CloudinaryController.get(_getCloudinaryDataFromBody(req, appData))
                        .then((/* getResult */) =>
                        {
                            CloudinaryController.delete(_getCloudinaryDataFromBody(req, appData))
                                .then((deleteResult) => _sendCloudinaryDeleteSuccess(res, deleteResult))
                                .catch((err) => _sendCloudinaryDeleteError(res, err));
                        })
                        .catch((err) => _sendCloudinaryGetError(res, err));
                })
                .catch((err) => _sendAppMicroserviceError(req, res, err));
        })
        .catch((err) => _sendPayloadValidationError(res, err));
});

app.delete('/delete-bulk', (req, res) =>
{
    validateDeleteBulkPayload(req.body)
        .then((/* _ */) =>
        {
            AppMicroservice.v1.get(req.body.app)
                .then((result) =>
                {
                    const appData = result.data.data[0];

                    CloudinaryController.deleteBulk(_getCloudinaryDataFromBody(req, appData))
                        .then((deleteResult) => _sendCloudinaryDeleteBulkSuccess(req, res, deleteResult))
                        .catch((err) => _sendCloudinaryDeleteError(res, err));
                })
                .catch((err) => _sendAppMicroserviceError(req, res, err));
        })
        .catch((err) => _sendPayloadValidationError(res, err));
});

function _sendCloudinaryDeleteSuccess(res/* , result */)
{
    Success.json({
        res,
        message: 'Successfully deleted file from Cloudinary',
    });
}

function _sendCloudinaryDeleteBulkSuccess(req, res, { numOfFilesDeleted = 0 })
{
    Success.json({
        res,
        message: `Successfully deleted files older than ${req.body.olderThanInDays ?? 7} days old from Cloudinary`,
        data: {
            numOfFilesDeleted,
        },
    });
}

function _sendCloudinaryDeleteError(res, err)
{
    const errMsg = 'Failed to delete file from Cloudinary';
    logger.error(errMsg, err);

    InternalServerError.json({
        res,
        message: errMsg,
        error: err.toJson(),
    });
}

/** *********
 * HELPERS *
 ********** */

function _sendQueryValidationError(res, err)
{
    ValidationError.json({
        res,
        message: 'Query Validation Error',
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
            message: 'Invalid appId or appName',
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
        const errMsg = 'An unknown error occurred while validating appId and appName';
        logger.error(errMsg, err.response.data.error || err, req.query, err.response.data);

        InternalServerError.json({
            res,
            message: errMsg,
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

function _getCloudinaryDataFromQuery(req, appData)
{
    return {
        ...req.query,
        appId: appData._id,
        appName: undefined,
    };
}

function _getCloudinaryDataFromBody(req, appData)
{
    return {
        ...req.body,
        app: undefined,
        appId: appData._id,
    };
}

module.exports = app;
