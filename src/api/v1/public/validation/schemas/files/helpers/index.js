const appSchemas = require("./app");
const fileSchemas = require("./file");
const fileNameSchemas = require("./fileName");
const imageOptionsSchemas = require("./imageOptions");
const nestedFoldersSchemas = require("./nestedFolders");



module.exports = {
    ...appSchemas,
    ...fileSchemas,
    ...fileNameSchemas,
    ...imageOptionsSchemas,
    ...nestedFoldersSchemas,
};
