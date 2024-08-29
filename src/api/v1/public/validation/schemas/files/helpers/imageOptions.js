const Joi = require("joi");



const imageOptions = Joi.object({
    effect: Joi.string().valid('upscale'),
});
const imageOptionsRequired = imageOptions.required();



module.exports = {
    imageOptions,
    imageOptionsRequired,
};
