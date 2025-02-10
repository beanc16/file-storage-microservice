const getSchemas = require('./get.js');
const uploadSchemas = require('./upload.js');
const renameSchemas = require('./rename.js');
const deleteSchemas = require('./delete.js');

module.exports = {
    ...getSchemas,
    ...uploadSchemas,
    ...renameSchemas,
    ...deleteSchemas,
};
