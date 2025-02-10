const { validateJoiSchema } = require('@beanc16/joi-helpers');
const { uploadFilesSchema } = require('../../schemas/index.js');

function validateUploadFilesPayload(payload)
{
    return new Promise((resolve, reject) =>
    {
        validateJoiSchema(uploadFilesSchema, payload)
            .then((value) =>
            {
                resolve(value);
            })
            .catch((error) =>
            {
                reject(error);
            });
    });
}

module.exports = {
    validateUploadFilesPayload,
};
