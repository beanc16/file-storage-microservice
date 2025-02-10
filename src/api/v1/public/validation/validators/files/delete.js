const { validateJoiSchema } = require('@beanc16/joi-helpers');
const { deleteFilesSchema, deleteBulkSchema } = require('../../schemas/index.js');

function validateDeleteFilesPayload(payload)
{
    return new Promise((resolve, reject) =>
    {
        validateJoiSchema(deleteFilesSchema, payload)
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

function validateDeleteBulkPayload(payload)
{
    return new Promise((resolve, reject) =>
    {
        validateJoiSchema(deleteBulkSchema, payload)
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
    validateDeleteFilesPayload,
    validateDeleteBulkPayload,
};
