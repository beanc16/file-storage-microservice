const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");



const file = Joi.alternatives().try(
    JoiRequired.object({
        dataUri: JoiRequired.string(),
        fileName: JoiRequired.string(),
    }),
    JoiRequired.object({
        url: JoiRequired.string(),
        fileName: Joi.string(),
    }),
);
const fileRequired = file.required();



module.exports = {
    file,
    fileRequired,
};