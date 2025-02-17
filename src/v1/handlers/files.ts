import { Success } from 'dotnet-responses';
import express from 'express';

import { CloudinaryController, CloudinaryOptions } from '../services/CloudinaryController.js';
import {
    getAppData,
    getCloudinaryData,
    sendQueryValidationError,
} from '../services/responseHelpers.js';
import { getFilesSchema, validateJoiSchema } from '../validation/index.js';

export const getFiles = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(getFilesSchema, req.query);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
    }

    const appData = await getAppData(req, res);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryData = await getCloudinaryData(req, res, appData, 'query');

    if (!cloudinaryData)
    {
        return undefined;
    }

    const {
        query: {
            imageOptions: untypedImageOptions,
        },
    } = req;

    const imageOptions = untypedImageOptions as unknown as CloudinaryOptions;

    if (!imageOptions)
    {
        Success.json({
            res,
            message: 'Successfully retrieved file from Cloudinary',
            data: {
                url: cloudinaryData.url,
            },
        });
        return undefined;
    }

    const fileExtension = CloudinaryController.getExtensionFromUrl(cloudinaryData.url);

    const upscaledUrl = CloudinaryController.doImageOperation({
        ...cloudinaryData,
        file: {
            fileName: cloudinaryData.fileName,
            fileExtension,
        },
        options: imageOptions,
    });

    Success.json({
        res,
        message: 'Successfully retrieved file from Cloudinary',
        data: {
            url: upscaledUrl,
        },
    });
    return undefined;
};
