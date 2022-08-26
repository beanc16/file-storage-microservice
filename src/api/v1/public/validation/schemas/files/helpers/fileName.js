const Joi = require("joi");



// Lowercase, uppercase, numbers, underscore, and hyphen
const _fileNameRegex = /^[\w-]+$/;

const fileName = Joi.string().pattern(_fileNameRegex);
const fileNameRequired = fileName.required();



module.exports = {
    fileName,
    fileNameRequired,
};
