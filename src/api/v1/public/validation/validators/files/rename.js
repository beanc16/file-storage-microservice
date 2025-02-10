const { validateJoiSchema } = require('@beanc16/joi-helpers');
const { renameFilesSchema } = require('../../schemas/index.js');

function validateRenameFilesPayload(payload)
{
    return new Promise((resolve, reject) =>
    {
        validateJoiSchema(renameFilesSchema, payload)
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
    validateRenameFilesPayload,
};
