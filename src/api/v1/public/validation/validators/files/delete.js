const { validateJoiSchema } = require("@beanc16/joi-helpers");
const { deleteFilesSchema, deleteBulkSchema } = require("../../schemas");



function validateDeleteFilesPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(deleteFilesSchema, payload)
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

function validateDeleteBulkPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(deleteBulkSchema, payload)
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
    validateDeleteFilesPayload,
    validateDeleteBulkPayload,
};