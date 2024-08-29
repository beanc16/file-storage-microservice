const Joi = require("joi");



const cloudinaryBackground = Joi.alternatives().try(
    Joi.string().valid(
        'white',
        'grey',
        'gray',
        'lightgrey',
        'lightgray',
        'black',
        'pink',
        'lightpink',
        'magenta',
        'red',
        'orange',
        'yellow',
        'lightyellow',
        'green',
        'lightgreen',
        'blue',
        'lightblue',
        'purple',
        'chocolate',
        'transparent',
        'none'
    ),
    Joi.string().regex(/^#[A-Fa-f0-9]{6}$/)
);

const imageOptions = Joi.object({
    background: cloudinaryBackground,
    effect: Joi.string().valid('upscale'),
});
const imageOptionsRequired = imageOptions.required();



module.exports = {
    imageOptions,
    imageOptionsRequired,
};
