const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");
const fileSchemas = require("./helpers");



const deleteFilesSchema = JoiRequired.object({
    app: fileSchemas.appRequired,
    fileName: fileSchemas.fileNameRequired,
    nestedFolders: fileSchemas.nestedFolders,
});



module.exports = {
    deleteFilesSchema,
};