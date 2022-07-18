const { uploadFilesSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateUploadFilesPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(uploadFilesSchema, payload)
            .then(function (value)
            {
                resolve(value);
            })
            .catch(function (error)
            {
                reject(error);
            });
    });
}



module.exports = {
    validateUploadFilesPayload,
};