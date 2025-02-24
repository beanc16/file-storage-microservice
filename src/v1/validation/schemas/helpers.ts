import Joi from 'joi';

// App
export const app = Joi.alternatives().try(
    Joi.object({
        id: Joi.string().required(),
        searchName: Joi.string().optional(),
    }).required(),
    Joi.object({
        id: Joi.string().optional(),
        searchName: Joi.string().optional(),
    }).required(),
);

// File Name
const fileNameRegex = /^[\w- ]+$/;

export const fileName = Joi.string().pattern(fileNameRegex);

// File
export const file = Joi.alternatives().try(
    Joi.object({
        dataUri: Joi.string().required(),
        fileName: Joi.string().required(),
    }).required(),
    Joi.object({
        url: Joi.string().required(),
        fileName: Joi.string().optional(),
    }).required(),
);

// Image Options
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
        'none',
    ),
    Joi.string().regex(/^#[A-Fa-f0-9]{6}$/),
);

export const imageOptions = Joi.object({
    background: cloudinaryBackground.optional(),
    effect: Joi.string().valid('upscale').optional(),
});

// Nested Folders
// Lowercase, hyphen, and forward slash
const nestedFoldersRegex = /^[a-zA-Z0-9\-/]+$/;

export const nestedFolders = Joi.string()
    .allow('')
    .pattern(nestedFoldersRegex);
