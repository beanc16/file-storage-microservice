const Joi = require('joi');

// Lowercase, hyphen, and forward slash
const _nestedFoldersRegex = /^[a-z\-/]+$/;

const nestedFolders = Joi.string()
    .allow('')
    .pattern(_nestedFoldersRegex);
const nestedFoldersRequired = nestedFolders.required();

module.exports = {
    nestedFolders,
    nestedFoldersRequired,
};
