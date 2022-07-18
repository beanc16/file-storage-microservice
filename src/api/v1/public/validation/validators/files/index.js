const getValidators = require("./get");
const uploadValidators = require("./upload");
const renameValidators = require("./rename");
const deleteValidators = require("./delete");



module.exports = {
    ...getValidators,
    ...uploadValidators,
    ...renameValidators,
    ...deleteValidators,
};