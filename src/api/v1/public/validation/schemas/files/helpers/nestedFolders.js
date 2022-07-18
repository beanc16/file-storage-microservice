const Joi = require("joi");



// Lowercase and hyphen
const _nestedFoldersRegex = /^[a-z\-]+$/;

const nestedFolders = Joi.string().pattern(_nestedFoldersRegex);
const nestedFoldersRequired = nestedFolders.required();



module.exports = {
    nestedFolders,
    nestedFoldersRequired,
};