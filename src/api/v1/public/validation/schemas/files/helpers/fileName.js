const Joi = require('joi');

// Lowercase, uppercase, numbers, underscore, hyphens, and spaces
const fileNameRegex = /^[\w- ]+$/;

const fileName = Joi.string().pattern(fileNameRegex);
const fileNameRequired = fileName.required();

module.exports = {
    fileName,
    fileNameRequired,
};
