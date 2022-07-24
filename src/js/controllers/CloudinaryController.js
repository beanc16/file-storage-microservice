// Cloudinary
const { cloudinaryConfigEnum } = require("../enums");
const cloudinary = require("cloudinary").v2;
cloudinary.config(cloudinaryConfigEnum);

// Files
const fs = require("fs");
const appRoot = require("app-root-path");

// Models
const { FileDoesNotExistError, JsonError } = require("../errors");



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
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
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
                (fileName === undefined)
            );
    
            // Upload file to cloudinary
            cloudinary.uploader.upload(url || dataUri, {
                ...options,
                "public_id": cloudinaryFilePath,
            })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(new JsonError(err));
            });
        });
    }

    static async rename({
        appId = process.env.FILE_STORAGE_MICROSERVICE_APP_ID,
        old: {
            nestedFolders: oldNestedFolders,
            fileName: oldFileName,
        },
        new: {
            nestedFolders: newNestedFolders,
            fileName: newFileName,
        },
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
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
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
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(new JsonError(err));
            });
        });
    }



    /***********
     * HELPERS *
     ***********/

    static _constructFilePaths(appId, nestedFolders, fileName = "")
    {
        // Local path
        const localFilePath = appRoot.resolve(`/uploads/${fileName}`);

        // Cloudinary path
        const fileNameWithoutExtension = (fileName.lastIndexOf(".") !== -1)
            ? fileName.substring(0, fileName.lastIndexOf("."))
            : fileName;
        const cloudinaryFilePath = `apps/${appId}/${(nestedFolders) ? `${nestedFolders}/` : ""}${fileNameWithoutExtension}`;
        
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
            const fileUrlWithoutExtension = (fileInfo.lastIndexOf(".") !== -1)
                ? fileInfo.substring(0, fileInfo.lastIndexOf("."))
                : fileInfo;

            // Remove everything from the URL before the file name
            fileName = (fileUrlWithoutExtension.lastIndexOf("/") !== -1)
                ? fileUrlWithoutExtension.substring(fileInfo.lastIndexOf("/"))
                : fileInfo;
        }

        const cloudinaryFilePath = `apps/${appId}/${(nestedFolders) ? `${nestedFolders}/` : ""}${fileName}`;
        
        return {
            cloudinaryFilePath,
        };
    }
}



module.exports = CloudinaryController;
