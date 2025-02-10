const { JoiRequired } = require('@beanc16/joi-helpers');
const Joi = require('joi');
const fileSchemas = require('./helpers/index.js');

const deleteFilesSchema = JoiRequired.object({
    app: fileSchemas.appRequired,
    nestedFolders: fileSchemas.nestedFolders,
});

const deleteBulkSchema = JoiRequired.object({
    app: fileSchemas.appRequired,
    nestedFolders: fileSchemas.nestedFolders,
    olderThanInDays: Joi.number().min(1).optional(),
});

module.exports = {
    deleteFilesSchema,
    deleteBulkSchema,
};
