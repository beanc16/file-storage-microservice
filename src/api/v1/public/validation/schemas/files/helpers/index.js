const appSchemas = require('./app.js');
const fileSchemas = require('./file.js');
const fileNameSchemas = require('./fileName.js');
const imageOptionsSchemas = require('./imageOptions.js');
const nestedFoldersSchemas = require('./nestedFolders.js');

module.exports = {
    ...appSchemas,
    ...fileSchemas,
    ...fileNameSchemas,
    ...imageOptionsSchemas,
    ...nestedFoldersSchemas,
};
