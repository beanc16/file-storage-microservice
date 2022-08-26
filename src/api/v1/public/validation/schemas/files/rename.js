const { JoiRequired } = require("@beanc16/joi-helpers");
const fileSchemas = require("./helpers");



const renameFilesSchema = JoiRequired.object({
    app: fileSchemas.appRequired,
    old: JoiRequired.object({
        fileName: fileSchemas.fileNameRequired,
        nestedFolders: fileSchemas.nestedFolders,
    }),
    new: JoiRequired.object({
        fileName: fileSchemas.fileNameRequired,
        nestedFolders: fileSchemas.nestedFolders,
    }),
});



module.exports = {
    renameFilesSchema,
};