const Joi = require('joi');

// Lowercase, uppercase, numbers, underscore, hyphens, and spaces
const _fileNameRegex = /^[\w- ]+$/;

const fileName = Joi.string().pattern(_fileNameRegex);
const fileNameRequired = fileName.required();

module.exports = {
    fileName,
    fileNameRequired,
};
