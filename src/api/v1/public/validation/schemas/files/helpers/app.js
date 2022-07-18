const Joi = require("joi");



const app = Joi.object({
    id: Joi.string(),
    searchName: Joi.string(),
});
const appRequired = app.required();



module.exports = {
    app,
    appRequired,
};