// Cloudinary
const cloudinary = require('cloudinary').v2;

// Files
const appRoot = require('app-root-path');

// Time
const dayjs = require('dayjs');

// Models
const { cloudinaryConfigEnum } = require('../enums/index.js');
const { JsonError } = require('../errors/index.js');

cloudinary.config(cloudinaryConfigEnum);

class CloudinaryController
{
    static async get({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        fileName,
        options = {
        },
    })
    {
        return new Promise((resolve, reject) =>
        {
            // Get file paths
            const {
                cloudinaryFilePath,
            } = this._constructFilePaths(appId, nestedFolders, fileName);

            // Get file from cloudinary
            cloudinary.api.resource(cloudinaryFilePath, options)
                .then((result) =>
                {
                    resolve(result);
                })
                .catch((err) =>
                {
                    reject(new JsonError(err));
                });
        });
    }

    static async upload({
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
    })
    {
        return new Promise((resolve, reject) =>
        {
            // Get file paths
            const {
                cloudinaryFilePath,
            } = this._constructFilePathsFromUrl(
                appId,
                nestedFolders,
                fileName || url,
                (fileName === undefined),
            );
    
            // Upload file to cloudinary
            cloudinary.uploader.upload(url || dataUri, {
                ...options,
                public_id: cloudinaryFilePath,
            })
                .then((result) =>
                {
                    resolve(result);
                })
                .catch((err) =>
                {
                    reject(new JsonError(err));
                });
        });
    }

    static async doImageOperation({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        file: { fileName = '', fileExtension = '' } = {},
        options = {
            effect: 'upscale',
        },
    })
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                // Get file paths
                const {
                    cloudinaryFilePath,
                } = this._constructFilePaths(appId, nestedFolders, fileName, fileExtension);

                // Do image effect
                const htmlImg = cloudinary.image(cloudinaryFilePath, options);
                const upscaledImageUrl = this._getSrcFromHtmlImgTag(htmlImg);
                resolve(upscaledImageUrl);
            }
            catch (err)
            {
                reject(err);
            }
        });
    }

    static async rename({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        old: { nestedFolders: oldNestedFolders, fileName: oldFileName },
        new: { nestedFolders: newNestedFolders, fileName: newFileName },
        options = {
            invalidate: true,
        },
    })
    {
        return new Promise((resolve, reject) =>
        {
            // Get file paths
            const {
                cloudinaryFilePath: oldCloudinaryFilePath,
            } = this._constructFilePaths(appId, oldNestedFolders, oldFileName);
            const {
                cloudinaryFilePath: newCloudinaryFilePath,
            } = this._constructFilePaths(appId, newNestedFolders, newFileName);
    
            // Rename file in cloudinary
            cloudinary.uploader.rename(oldCloudinaryFilePath, newCloudinaryFilePath, options)
                .then((result) =>
                {
                    resolve(result);
                })
                .catch((err) =>
                {
                    reject(new JsonError(err));
                });
        });
    }

    static async delete({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        fileName,
        options = {
            invalidate: true,
        },
    })
    {
        return new Promise((resolve, reject) =>
        {
            // Get file paths
            const {
                cloudinaryFilePath,
            } = this._constructFilePaths(appId, nestedFolders, fileName);
    
            // Upload file to cloudinary
            cloudinary.uploader.destroy(cloudinaryFilePath, options)
                .then((result) =>
                {
                    resolve(result);
                })
                .catch((err) =>
                {
                    reject(new JsonError(err));
                });
        });
    }

    static async deleteBulk({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        nestedFolders,
        olderThanInDays = 7,
    })
    {
        return new Promise((resolve, reject) =>
        {
            // Get file paths
            const {
                cloudinaryFilePath,
            } = this._constructFilePaths(appId, nestedFolders);

            cloudinary.api.resources({
                prefix: cloudinaryFilePath,
                max_results: 500,
                type: 'upload',
            })
            .then(({ resources = [] }) => {
                const { chunkedResourcesToDelete } = resources.reduce((acc, { created_at, public_id }) => {
                    // Get the number of days passed since the resource was created
                    const daysPassed = dayjs().diff(
                        dayjs(created_at),
                        'days',
                        true
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
                    resolve({ numOfFilesDeleted: 0 });
                }

                // Delete all resources
                const deletePromises = chunkedResourcesToDelete.map(async (resourcesToDelete) => {
                    await cloudinary.api.delete_resources(resourcesToDelete);
                });

                Promise.all(deletePromises)
                .then((results) => {
                    const output = results.reduce((acc, result) => {
                        return {
                            ...acc,
                            ...result,
                        };
                    }, { numOfFilesDeleted: resources.length });

                    resolve(output);
                })
                .catch((err) =>
                {
                    reject(new JsonError(err));
                });
            });
        });
    }

    /** *********
     * HELPERS *
     ********** */

    static getExtensionFromUrl(url, includeDotBeforeExtension = true)
    {
        let indexOfExtension = url.lastIndexOf('.');

        if (!includeDotBeforeExtension)
        {
            indexOfExtension += 1;
        }

        return url.substring(indexOfExtension);
    }

    static _constructFilePaths(appId, nestedFolders, fileName = '', fileExtension = '')
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

    static _constructFilePathsFromUrl(appId, nestedFolders, fileInfo, isUrl)
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

    static _getSrcFromHtmlImgTag(htmlImgTag)
    {
        const regex = /(<img.+src=["'])(.*)(["'].+>)/ig;
        return htmlImgTag.replace(regex, '$2');
    }
}

module.exports = CloudinaryController;
