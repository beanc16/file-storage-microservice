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
    static async upload({ appName = "file-storage-microservice", nestedFolders, fileName })
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



    /***********
     * HELPERS *
     ***********/

    static _constructFilePaths(appName, nestedFolders, fileName)
    {
        // Local path
        const localFilePath = appRoot.resolve(`/uploads/${fileName}`);

        // Cloudinary path
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));
        const cloudinaryFilePath = `apps/${appName}/${`${nestedFolders}/` || ""}${fileNameWithoutExtension}`;
        
        return {
            localFilePath,
            cloudinaryFilePath,
        };
    }
}



module.exports = CloudinaryController;
