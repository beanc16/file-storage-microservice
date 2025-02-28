import type { AppGetParametersV1 } from '@beanc16/microservices-abstraction';
import { InternalServerError, Success } from 'dotnet-responses';
import express from 'express';

import {
    CloudinaryController,
    type CloudinaryOptions,
    type DeleteBulkCloudinaryOptions,
    type DeleteCloudinaryOptions,
    type RenameCloudinaryOptions,
    type UploadCloudinaryOptions,
} from '../services/CloudinaryController.js';
import {
    getAppData,
    getCloudinaryData,
    type GetCloudinaryDataResponse,
    getCloudinaryDatas,
    sendQueryValidationError,
} from '../services/responseHelpers.js';
import {
    deleteBulkSchema,
    deleteFilesSchema,
    getFilesInFolderSchema,
    getFilesSchema,
    renameFilesSchema,
    uploadFilesSchema,
    validateJoiSchema,
} from '../validation/index.js';

export const getFilesInFolder = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(getFilesInFolderSchema, req.query);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
        return undefined;
    }

    const appData = await getAppData(req, res);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryDatas = await getCloudinaryDatas({
        req,
        res,
        appData,
        errorMessage: 'Failed to retrieve files in folder from Cloudinary',
    });

    if (!cloudinaryDatas)
    {
        return undefined;
    }

    const {
        query: { nestedFolders, imageOptions },
    } = req as unknown as {
        query: {
            nestedFolders: string;
            imageOptions: CloudinaryOptions | undefined;
        };
    };

    if (!imageOptions)
    {
        Success.json({
            res,
            message: 'Successfully retrieved files in folder from Cloudinary',
            data: {
                files: cloudinaryDatas.map(({ fileName, url }) =>
                {
                    return { fileName, url };
                }),
            },
        });
        return undefined;
    }

    const files = cloudinaryDatas.map(({ fileName, url }) =>
    {
        const fileExtension = CloudinaryController.getExtensionFromUrl(url);
        const upscaledUrl = CloudinaryController.doImageOperation({
            // eslint-disable-next-line no-underscore-dangle -- Allow the id to have an underscore
            appId: appData._id,
            nestedFolders,
            file: {
                fileName,
                fileExtension,
            },
            options: imageOptions,
        });

        return {
            fileName,
            url: upscaledUrl,
        };
    });

    Success.json({
        res,
        message: 'Successfully retrieved files in folder from Cloudinary',
        data: {
            files,
        },
    });
    return undefined;
};

export const getFiles = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(getFilesSchema, req.query);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
        return undefined;
    }

    const appData = await getAppData(req, res);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryData = await getCloudinaryData({
        req,
        res,
        appData,
        from: 'query',
        getFromCloudinary: true,
        errorMessage: 'Failed to retrieve file from Cloudinary',
    }) as GetCloudinaryDataResponse | undefined;

    if (!cloudinaryData)
    {
        return undefined;
    }

    const {
        query: {
            imageOptions,
        },
    } = req as unknown as {
        query: {
            imageOptions: CloudinaryOptions | undefined;
        };
    };

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

export const uploadFile = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(uploadFilesSchema, req.body);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
        return undefined;
    }

    const appData = await getAppData(req, res, (req.body as { app: AppGetParametersV1 }).app);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryData = await getCloudinaryData({
        req,
        res,
        appData,
        from: 'body',
        getFromCloudinary: false,
        errorMessage: 'Failed to save file to Cloudinary',
    }) as UploadCloudinaryOptions | undefined;

    if (!cloudinaryData)
    {
        return undefined;
    }
    const result = await CloudinaryController.upload(cloudinaryData);

    const {
        body: {
            imageOptions,
        },
    } = req as unknown as {
        body: {
            imageOptions: CloudinaryOptions | undefined;
        };
    };

    if (!imageOptions)
    {
        Success.json({
            res,
            message: 'Successfully saved file to Cloudinary',
            data: {
                url: result.url,
            },
        });
        return undefined;
    }

    const fileExtension = CloudinaryController.getExtensionFromUrl(result.url);

    const upscaledUrl = CloudinaryController.doImageOperation({
        ...cloudinaryData,
        file: {
            ...cloudinaryData.file,
            fileExtension,
        },
        options: imageOptions,
    });

    Success.json({
        res,
        message: 'Successfully saved file to Cloudinary',
        data: {
            url: upscaledUrl,
        },
    });
    return undefined;
};

export const renameFile = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(renameFilesSchema, req.body);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
        return undefined;
    }

    const appData = await getAppData(req, res, (req.body as { app: AppGetParametersV1 }).app);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryData = await getCloudinaryData({
        req,
        res,
        appData,
        from: 'body',
        getFromCloudinary: false,
        errorMessage: 'Failed to rename file in Cloudinary',
    }) as RenameCloudinaryOptions | undefined;

    if (!cloudinaryData)
    {
        return undefined;
    }
    const result = await CloudinaryController.rename(cloudinaryData);

    if (!result)
    {
        InternalServerError.json({
            res,
            message: 'Failed to rename file in Cloudinary',
            error: {
                message: 'Request failed with status code 404',
            },
        });
        return undefined;
    }

    Success.json({
        res,
        message: 'Successfully renamed file on Cloudinary',
        data: {
            url: result.url,
        },
    });
    return undefined;
};

export const deleteFile = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(deleteFilesSchema, req.body);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
        return undefined;
    }

    const appData = await getAppData(req, res, (req.body as { app: AppGetParametersV1 }).app);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryData = await getCloudinaryData({
        req,
        res,
        appData,
        from: 'body',
        getFromCloudinary: true,
        errorMessage: 'Failed to delete file in Cloudinary',
    }) as DeleteCloudinaryOptions | undefined;

    if (!cloudinaryData)
    {
        return undefined;
    }
    await CloudinaryController.delete(cloudinaryData);

    Success.json({
        res,
        message: 'Successfully deleted file from Cloudinary',
    });
    return undefined;
};

export const deleteBulk = async (req: express.Request, res: express.Response): Promise<void> =>
{
    try
    {
        validateJoiSchema(deleteBulkSchema, req.body);
    }
    catch (error)
    {
        sendQueryValidationError(res, error as Error);
        return undefined;
    }

    const appData = await getAppData(req, res, (req.body as { app: AppGetParametersV1 }).app);

    if (!appData)
    {
        return undefined;
    }

    const cloudinaryData = await getCloudinaryData({
        req,
        res,
        appData,
        from: 'body',
        getFromCloudinary: false,
        errorMessage: 'Failed to bulk delete files in Cloudinary',
    }) as DeleteBulkCloudinaryOptions | undefined;

    if (!cloudinaryData)
    {
        return undefined;
    }
    const result = await CloudinaryController.deleteBulk(cloudinaryData);

    Success.json({
        res,
        message: `Successfully deleted files older than ${cloudinaryData.olderThanInDays ?? 7} days old from Cloudinary`,
        data: result,
    });
    return undefined;
};
