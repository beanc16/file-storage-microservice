import appRoot from 'app-root-path';
import axios from 'axios';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import dayjs from 'dayjs';

import { cloudinaryConfigEnum } from '../constants.js';
import { JsonError } from '../errors/index.js';
import type {
    CloudinaryDeleteResourcesResponse,
    CloudinaryDestroyResponse,
    CloudinaryResource,
} from './types/Cloudinary.js';

cloudinary.config(cloudinaryConfigEnum);

export interface CloudinaryOptions
{
    effect: 'upscale';
    invalidate?: boolean;
    overwrite?: boolean;
}

export interface GetFilesInFolderCloudinaryOptions
{
    appId: string | undefined;
    nestedFolders: string;
    resourceType?: 'image' | 'video';
}

export interface GetCloudinaryOptions
{
    appId: string | undefined;
    nestedFolders: string;
    fileName: string;
    options?: Omit<CloudinaryOptions, 'effect'>;
    resourceType: 'image' | 'video';
};

export interface UploadCloudinaryOptions
{
    appId: string | undefined;
    nestedFolders: string;
    file: {
        dataUri?: string;
        fileName?: string;
        url?: string;
    };
    options?: Pick<CloudinaryOptions, 'overwrite'>;
}

export interface RenameCloudinaryOptions
{
    appId: string | undefined;
    old: {
        nestedFolders: string;
        fileName: string;
    };
    new: {
        nestedFolders: string;
        fileName: string;
    };
    options?: Pick<CloudinaryOptions, 'invalidate'>;
}

export interface DeleteCloudinaryOptions
{
    appId: string | undefined;
    nestedFolders: string;
    fileName: string;
    options?: Pick<CloudinaryOptions, 'invalidate'>;
}

interface DeleteResponse
{
    result: string;
}

export interface DeleteBulkCloudinaryOptions
{
    appId: string | undefined;
    nestedFolders: string;
    olderThanInDays: number;
}

interface DeleteBulkResponse
{
    numOfFilesDeleted: number;
}

export class CloudinaryController
{
    public static async getFilesInFolder({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        resourceType = 'image',
    }: GetFilesInFolderCloudinaryOptions): Promise<CloudinaryResource[]>
    {
        const {
            cloudinaryFilePath,
        } = this.constructFilePaths(appId, nestedFolders);

        const { resources = [] } = await cloudinary.api.resources({
            prefix: cloudinaryFilePath,
            max_results: 500,
            type: 'upload',
            resource_type: resourceType,
        }) as {
            resources: Omit<CloudinaryResource, 'fileName'>[];
        };

        return resources.map((resource) => this.addFileNameToResource(resource, 'public_id'));
    }

    public static async get({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        fileName,
        options = {},
    }: GetCloudinaryOptions): Promise<CloudinaryResource>
    {
        let cloudinaryFilePath = '';

        try
        {
            // Get file paths
            const filePaths = this.constructFilePaths(appId, nestedFolders, fileName);
            cloudinaryFilePath = filePaths.cloudinaryFilePath;

            // Get file from cloudinary
            const resource = await cloudinary.api.resource(cloudinaryFilePath, options) as Omit<CloudinaryResource, 'fileName'>;
            return this.addFileNameToResource(resource, 'public_id');
        }

        /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
        catch (error: any)
        {
            try
            {
                if (error.error.http_code === 404)
                /* eslint-enable */
                {
                    // Generate url (without validating if it exists or not)
                    const url = cloudinary.url(cloudinaryFilePath, { resource_type: 'video' });

                    // Validate URL (will throw error if the file does not exist)
                    await axios.get(url);

                    return this.addFileNameToResource({
                        url,
                    } as CloudinaryResource, 'url');
                }

                throw error;
            }
            catch (error2)
            {
                throw new JsonError(error2 as Error);
            }
        }
    }

    public static async upload({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        file: {
            dataUri,
            fileName,
            url,
        } = {},
        options = {
            overwrite: false,
        },
    }: UploadCloudinaryOptions): Promise<UploadApiResponse>
    {
        try
        {
            // Get file paths
            const {
                cloudinaryFilePath,
            } = this.constructFilePathsFromUrl(
                appId,
                nestedFolders,
                (fileName || url) as string, // TODO: Update parameters to make one of these required later
                (fileName === undefined),
            );

            // Upload file to cloudinary
            return await cloudinary.uploader.upload((url || dataUri) as string, { // TODO: Update parameters to make one of these required later
                ...options,
                public_id: cloudinaryFilePath,
            });
        }

        catch (error)
        {
            throw new JsonError(error as Error);
        }
    }

    public static doImageOperation({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        file: { fileName = '', fileExtension = '' } = {},
        options = {
            effect: 'upscale',
        },
    }: {
        appId: string | undefined;
        nestedFolders: string;
        file: {
            fileName?: string;
            fileExtension?: string;
        };
        options?: Pick<CloudinaryOptions, 'effect'>;
    }): string
    {
        try
        {
            // Get file paths
            const {
                cloudinaryFilePath,
            } = this.constructFilePaths(appId, nestedFolders, fileName, fileExtension);

            // Do image effect
            const htmlImg = cloudinary.image(cloudinaryFilePath, options);
            const upscaledImageUrl = this.getSrcFromHtmlImgTag(htmlImg);
            return upscaledImageUrl;
        }

        catch (error)
        {
            throw new JsonError(error as Error);
        }
    }

    public static async rename({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        old: { nestedFolders: oldNestedFolders, fileName: oldFileName },
        new: { nestedFolders: newNestedFolders, fileName: newFileName },
        options = {
            invalidate: true,
        },
    }: RenameCloudinaryOptions): Promise<CloudinaryResource>
    {
        try
        {
            // Get file paths
            const {
                cloudinaryFilePath: oldCloudinaryFilePath,
            } = this.constructFilePaths(appId, oldNestedFolders, oldFileName);
            const {
                cloudinaryFilePath: newCloudinaryFilePath,
            } = this.constructFilePaths(appId, newNestedFolders, newFileName);

            // Rename file in cloudinary
            const resource = await cloudinary.uploader.rename(oldCloudinaryFilePath, newCloudinaryFilePath, options) as Omit<CloudinaryResource, 'fileName'>;
            return this.addFileNameToResource(resource, 'public_id');
        }

        catch (error)
        {
            throw new JsonError(error as Error);
        }
    }

    public static async delete({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        fileName,
        options = {
            invalidate: true,
        },
    }: DeleteCloudinaryOptions): Promise<DeleteResponse>
    {
        try
        {
            const {
                cloudinaryFilePath,
            } = this.constructFilePaths(appId, nestedFolders, fileName);

            return await cloudinary.uploader.destroy(cloudinaryFilePath, options) as CloudinaryDestroyResponse;
        }

        catch (error)
        {
            throw new JsonError(error as Error);
        }
    }

    public static async deleteBulk({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        olderThanInDays = 7,
    }: DeleteBulkCloudinaryOptions): Promise<DeleteBulkResponse>
    {
        try
        {
            const resources = await this.getFilesInFolder({ appId, nestedFolders });

            const { chunkedResourcesToDelete } = resources.reduce<{
                chunkedResourcesToDelete: string[][];
                curChunk: number;
            }>((acc, { created_at, public_id }) =>
            {
                // Get the number of days passed since the resource was created
                const daysPassed = dayjs().diff(
                    dayjs(created_at),
                    'days',
                    true,
                );

                // Include the resource for deletion if enough time has passed
                if (daysPassed >= olderThanInDays)
                {
                    acc.chunkedResourcesToDelete[acc.curChunk].push(public_id);
                }

                // Cloudinary can only delete 100 resources at a time.
                // Thus, chunk the resources to delete into groups of 100.
                if (acc.chunkedResourcesToDelete[acc.curChunk].length >= 100)
                {
                    acc.curChunk += 1;
                    acc.chunkedResourcesToDelete.push([]);
                }

                return acc;
            }, {
                chunkedResourcesToDelete: [[]],
                curChunk: 0,
            });

            // Exit early if there are no resources to delete
            if (
                chunkedResourcesToDelete.length === 1
                && chunkedResourcesToDelete[0].length === 0
            )
            {
                return { numOfFilesDeleted: 0 };
            }

            // Delete all resources
            const deletePromises = chunkedResourcesToDelete.map(async (resourcesToDelete) =>
                await (cloudinary.api.delete_resources(resourcesToDelete) as Promise<CloudinaryDeleteResourcesResponse>),
            );

            const results = await Promise.all(deletePromises);
            return results.reduce((acc, result) =>
            {
                return {
                    ...acc,
                    ...result,
                };
            }, { numOfFilesDeleted: resources.length });
        }

        catch (error)
        {
            throw new JsonError(error as Error);
        }
    }

    public static getExtensionFromUrl(url: string, includeDotBeforeExtension = true): string
    {
        let indexOfExtension = url.lastIndexOf('.');

        if (!includeDotBeforeExtension)
        {
            indexOfExtension += 1;
        }

        return url.substring(indexOfExtension);
    }

    private static constructFilePaths(
        appId: string | undefined,
        nestedFolders: string,
        fileName = '',
        fileExtension = '',
    ): { localFilePath: string; cloudinaryFilePath: string }
    {
        // Local path
        const localFilePath = appRoot.resolve(`/uploads/${fileName}`);

        // Cloudinary path
        const fileNameWithoutExtension = (fileName.lastIndexOf('.') !== -1)
            ? fileName.substring(0, fileName.lastIndexOf('.'))
            : fileName;
        const cloudinaryFilePath = `apps/${appId}/${(nestedFolders) ? `${nestedFolders}/` : ''}${fileNameWithoutExtension}${fileExtension}`;

        return {
            localFilePath,
            cloudinaryFilePath,
        };
    }

    private static constructFilePathsFromUrl(
        appId: string | undefined,
        nestedFolders: string,
        fileInfo: string,
        isUrl: boolean,
    ): { cloudinaryFilePath: string }
    {
        let fileName = fileInfo;

        // fileInfo is a URL
        if (isUrl)
        {
            const fileUrlWithoutExtension = (fileInfo.lastIndexOf('.') !== -1)
                ? fileInfo.substring(0, fileInfo.lastIndexOf('.'))
                : fileInfo;

            // Remove everything from the URL before the file name
            fileName = (fileUrlWithoutExtension.lastIndexOf('/') !== -1)
                ? fileUrlWithoutExtension.substring(fileInfo.lastIndexOf('/'))
                : fileInfo;
        }

        const cloudinaryFilePath = `apps/${appId}/${(nestedFolders) ? `${nestedFolders}/` : ''}${fileName}`;

        return {
            cloudinaryFilePath,
        };
    }

    private static getSrcFromHtmlImgTag(htmlImgTag: string): string
    {
        const regex = /(<img.+src=["'])(.*)(["'].+>)/ig;
        return htmlImgTag.replace(regex, '$2');
    }

    private static addFileNameToResource(cloudResource: Omit<CloudinaryResource, 'fileName'>, key: 'public_id' | 'url'): CloudinaryResource
    {
        const { [key]: value } = cloudResource;
        const fileNameWithExtension = value.substring(value.lastIndexOf('/') + 1);

        return {
            ...cloudResource,
            fileName: fileNameWithExtension.split('.').slice(0, -1).join('.') || fileNameWithExtension,
        };
    }
}
