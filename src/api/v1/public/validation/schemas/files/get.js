const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");
const fileSchemas = require("./helpers");



const getFilesSchema = JoiRequired.alternatives().try(
    JoiRequired.object({
        appId: JoiRequired.string(),
        appName: Joi.string(),
        fileName: fileSchemas.fileNameRequired,
        nestedFolders: fileSchemas.nestedFolders,
    }),
    JoiRequired.object({
        appId: Joi.string(),
        appName: JoiRequired.string(),
        fileName: fileSchemas.fileNameRequired,
        nestedFolders: fileSchemas.nestedFolders,
    }),
);



module.exports = {
    getFilesSchema,
};