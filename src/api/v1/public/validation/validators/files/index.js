const getValidators = require('./get.js');
const uploadValidators = require('./upload.js');
const renameValidators = require('./rename.js');
const deleteValidators = require('./delete.js');

module.exports = {
    ...getValidators,
    ...uploadValidators,
    ...renameValidators,
    ...deleteValidators,
};
