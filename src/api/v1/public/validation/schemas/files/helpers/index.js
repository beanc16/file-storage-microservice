const appSchemas = require("./app");
const fileSchemas = require("./file");
const nestedFoldersSchemas = require("./nestedFolders");



module.exports = {
    ...appSchemas,
    ...fileSchemas,
    ...nestedFoldersSchemas,
};
