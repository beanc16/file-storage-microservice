const { JoiRequired } = require("@beanc16/joi-helpers");
const fileSchemas = require("./helpers");



const uploadFilesSchema = JoiRequired.object({
    app: fileSchemas.appRequired,
    file: fileSchemas.fileRequired,
    nestedFolders: fileSchemas.nestedFolders,
    imageOptions: fileSchemas.imageOptions,
});



module.exports = {
    uploadFilesSchema,
};