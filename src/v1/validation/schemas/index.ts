import Joi from 'joi';

import * as fileSchemas from './helpers.js';

export const getFilesInFolderSchema = Joi.alternatives().try(
    Joi.object({
        appId: Joi.string().required(),
        appName: Joi.string().optional(),
        nestedFolders: fileSchemas.nestedFolders.required(),
        imageOptions: fileSchemas.imageOptions.optional(),
        resourceType: Joi.string().valid('image').optional(),
    }).required(),
    Joi.object({
        appId: Joi.string().optional(),
        appName: Joi.string().required(),
        nestedFolders: fileSchemas.nestedFolders.required(),
        imageOptions: fileSchemas.imageOptions.optional(),
        resourceType: Joi.string().valid('image').optional(),
    }).required(),
    Joi.object({
        appId: Joi.string().required(),
        appName: Joi.string().optional(),
        nestedFolders: fileSchemas.nestedFolders.required(),
        resourceType: Joi.string().valid('video').required(),
    }).required(),
    Joi.object({
        appId: Joi.string().optional(),
        appName: Joi.string().required(),
        nestedFolders: fileSchemas.nestedFolders.required(),
        resourceType: Joi.string().valid('video').required(),
    }).required(),
).required();

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
    resourceType: fileSchemas.resourceType.optional(),
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
    resourceType: fileSchemas.resourceType.optional(),
}).required();

export const deleteFilesSchema = Joi.object({
    app: fileSchemas.app.required(),
    fileName: fileSchemas.fileName.required(),
    nestedFolders: fileSchemas.nestedFolders.optional(),
    resourceType: fileSchemas.resourceType.optional(),
}).required();

export const deleteBulkSchema = Joi.object({
    app: fileSchemas.app.required(),
    nestedFolders: fileSchemas.nestedFolders.optional(),
    olderThanInDays: Joi.number().min(1).optional(),
}).required();
