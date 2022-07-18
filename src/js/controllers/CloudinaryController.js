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
        appName = "file-storage-microservice",
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
            } = this._constructFilePaths(appName, nestedFolders, fileName);

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
        appName = "file-storage-microservice",
        nestedFolders,
        fileName,
        options = {
            overwrite: false,
        },
    })
    {
        return new Promise((resolve, reject) =>
        {
            // Get file paths
            const {
                localFilePath,
                cloudinaryFilePath,
            } = this._constructFilePaths(appName, nestedFolders, fileName);

            if (!fs.existsSync(localFilePath))
            {
                reject(new FileDoesNotExistError(localFilePath));
            }
    
            // Upload file to cloudinary
            cloudinary.uploader.upload(localFilePath, {
                ...options,
                "public_id": cloudinaryFilePath,
            })
            .then((result) => {
                // Delete file locally
                fs.unlinkSync(localFilePath);
                resolve(result);
            })
            .catch((err) => {
                // Delete file locally
                fs.unlinkSync(localFilePath);
                reject(new JsonError(err));
            });
        });
    }

    static async rename({
        appName = "file-storage-microservice",
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
            } = this._constructFilePaths(appName, oldNestedFolders, oldFileName);
            const {
                cloudinaryFilePath: newCloudinaryFilePath,
            } = this._constructFilePaths(appName, newNestedFolders, newFileName);
    
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
        appName = "file-storage-microservice",
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
            } = this._constructFilePaths(appName, nestedFolders, fileName);
    
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

    static _constructFilePaths(appName, nestedFolders, fileName)
    {
        // Local path
        const localFilePath = appRoot.resolve(`/uploads/${fileName}`);

        // Cloudinary path
        const fileNameWithoutExtension = (fileName.lastIndexOf(".") !== -1)
            ? fileName.substring(0, fileName.lastIndexOf("."))
            : fileName;
        const cloudinaryFilePath = `apps/${appName}/${(nestedFolders) ? `${nestedFolders}/` : ""}${fileNameWithoutExtension}`;
        
        return {
            localFilePath,
            cloudinaryFilePath,
        };
    }
}



module.exports = CloudinaryController;
