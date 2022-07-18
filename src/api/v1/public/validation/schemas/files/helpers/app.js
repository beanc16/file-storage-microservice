const Joi = require("joi");
const { JoiRequired } = require("@beanc16/joi-helpers");



const app = Joi.alternatives().try(
    JoiRequired.object({
        id: JoiRequired.string(),
        searchName: Joi.string(),
    }),
    JoiRequired.object({
        id: Joi.string(),
        searchName: JoiRequired.string(),
    }),
);
const appRequired = app.required();



module.exports = {
    app,
    appRequired,
};