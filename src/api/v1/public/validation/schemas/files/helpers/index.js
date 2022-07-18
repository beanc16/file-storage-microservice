const appSchemas = require("./app");
const fileNameSchemas = require("./fileName");
const nestedFoldersSchemas = require("./nestedFolders");



module.exports = {
    ...appSchemas,
    ...fileNameSchemas,
    ...nestedFoldersSchemas,
};
