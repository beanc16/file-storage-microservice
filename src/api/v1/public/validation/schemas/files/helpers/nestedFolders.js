const Joi = require('joi');

// Lowercase, hyphen, and forward slash
const nestedFoldersRegex = /^[a-z\-/]+$/;

const nestedFolders = Joi.string()
    .allow('')
    .pattern(nestedFoldersRegex);
const nestedFoldersRequired = nestedFolders.required();

module.exports = {
    nestedFolders,
    nestedFoldersRequired,
};
