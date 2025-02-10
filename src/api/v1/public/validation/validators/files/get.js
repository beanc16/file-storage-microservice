const { validateJoiSchema } = require('@beanc16/joi-helpers');
const { getFilesSchema } = require('../../schemas/index.js');

function validateGetFilesPayload(payload)
{
    return new Promise((resolve, reject) =>
    {
        validateJoiSchema(getFilesSchema, payload)
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
    validateGetFilesPayload,
};
