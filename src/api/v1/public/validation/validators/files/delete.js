const { deleteFilesSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



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



module.exports = {
    validateDeleteFilesPayload,
};