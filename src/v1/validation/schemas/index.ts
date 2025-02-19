import Joi from 'joi';

import * as fileSchemas from './helpers.js';

export const getFilesSchema = Joi.alternatives().try(
    Joi.object({
        appId: Joi.string().required(),
        appName: Joi.string().optional(),
        fileName: fileSchemas.fileName.required(),
        nestedFolders: fileSchemas.nestedFolders.optional(),
        imageOptions: fileSchemas.imageOptions.optional(),
    }).required(),
    Joi.object({
        appId: Joi.string().optional(),
        appName: Joi.string().required(),
        fileName: fileSchemas.fileName.required(),
        nestedFolders: fileSchemas.nestedFolders.optional(),
        imageOptions: fileSchemas.imageOptions.optional(),
    }).required(),
).required();

export const uploadFilesSchema = Joi.object({
    app: fileSchemas.app.required(),
    file: fileSchemas.file.required(),
    nestedFolders: fileSchemas.nestedFolders.optional(),
    imageOptions: fileSchemas.imageOptions.optional(),
}).required();

export const renameFilesSchema = Joi.object({
    app: fileSchemas.app.required(),
    old: Joi.object({
        fileName: fileSchemas.fileName.required(),
        nestedFolders: fileSchemas.nestedFolders.optional(),
    }).required(),
    new: Joi.object({
        fileName: fileSchemas.fileName.required(),
        nestedFolders: fileSchemas.nestedFolders.optional(),
    }).required(),
}).required();

export const deleteFilesSchema = Joi.object({
    app: fileSchemas.app.required(),
    fileName: fileSchemas.fileName.required(),
    nestedFolders: fileSchemas.nestedFolders.optional(),
}).required();

export const deleteBulkSchema = Joi.object({
    app: fileSchemas.app.required(),
    nestedFolders: fileSchemas.nestedFolders.optional(),
    olderThanInDays: Joi.number().min(1).optional(),
}).required();
