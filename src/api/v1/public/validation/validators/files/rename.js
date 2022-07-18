const { renameFilesSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateRenameFilesPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(renameFilesSchema, payload)
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
    validateRenameFilesPayload,
};