import { logger } from '@beanc16/logger';
import {
    type AppBaseResponseV1,
    type AppGetParametersV1,
    AppMicroservice,
} from '@beanc16/microservices-abstraction';
import type { AxiosError } from 'axios';
import {
    InternalServerError,
    NotFound,
    ValidationError,
} from 'dotnet-responses';
import express from 'express';

import { JsonError } from '../errors/JsonError.js';
import {
    CloudinaryController,
    type DeleteBulkCloudinaryOptions,
    type DeleteCloudinaryOptions,
    type GetCloudinaryOptions,
    type RenameCloudinaryOptions,
    type UploadCloudinaryOptions,
} from './CloudinaryController.js';
import type { CloudinaryResource } from './types/Cloudinary.js';

type AppData = AppBaseResponseV1['data']['0'];

export type GetCloudinaryDataResponse = GetCloudinaryOptions & CloudinaryResource;

export const getAppData = async (req: express.Request, res: express.Response, appData?: AppGetParametersV1): Promise<AppData | undefined> =>
{
    try
    {
        const {
            data: [appResult],
        } = await AppMicroservice.v1.get(appData ?? {
            id: (req.query.appId as string) || process.env.FILE_STORAGE_MICROSERVICE_APP_ID || undefined,
            searchName: req.query.appName as string || undefined,
        });

        return appResult;
    }
    catch (error)
    {
        const err = error as AxiosError<AppBaseResponseV1>;
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
                error: err.response?.data?.error as object | undefined,
            });
        }

        else
        {
            const errMsg = 'An unknown error occurred while validating appId and appName';
            logger.error(errMsg, err.response?.data?.error || err, req.query, err?.response?.data);

            InternalServerError.json({
                res,
                message: errMsg,
                data: req.query,
                error: err?.response?.data?.error || err,
            });
        }

        return undefined;
    }
};

export const getCloudinaryData = async ({
    req,
    res,
    appData,
    from,
    getFromCloudinary,
    errorMessage,
}: {
    req: express.Request;
    res: express.Response;
    appData: AppData;
    from: 'query' | 'body';
    getFromCloudinary: boolean;
    errorMessage: string;
}): Promise<GetCloudinaryDataResponse | UploadCloudinaryOptions | RenameCloudinaryOptions | DeleteCloudinaryOptions | DeleteBulkCloudinaryOptions | undefined> =>
{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Allow the results to be any
    const reqSource = (from === 'query') ? req.query : req.body;

    const {
        app: _app,
        appName: _appName,
        ...data
    } = reqSource as Record<string, unknown>;

    const { _id: appId } = appData;

    const cloudinaryData = {
        ...data,
        appId,
    } as GetCloudinaryOptions;

    if (!getFromCloudinary)
    {
        return cloudinaryData;
    }

    try
    {
        const cloudinaryResult = await CloudinaryController.get(cloudinaryData);
        return { ...cloudinaryResult, ...cloudinaryData };
    }

    catch (error)
    {
        const err = error as JsonError;
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
            logger.error(errorMessage, err);

            InternalServerError.json({
                res,
                message: errorMessage,
                error: err.toJson(),
            });
        }

        return undefined;
    }
};

export const sendQueryValidationError = (res: express.Response, err: Error): void =>
{
    ValidationError.json({
        res,
        message: 'Query Validation Error',
        error: err,
    });
};
