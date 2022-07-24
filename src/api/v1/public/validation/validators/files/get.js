const { getFilesSchema } = require("../../schemas");
const { validateJoiSchema } = require("@beanc16/joi-helpers");



function validateGetFilesPayload(payload)
{
    return new Promise(function (resolve, reject)
    {
        validateJoiSchema(getFilesSchema, payload)
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
    validateGetFilesPayload,
};