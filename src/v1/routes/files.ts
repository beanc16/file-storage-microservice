import bodyParser from 'body-parser';
import express from 'express';

import * as handlers from '../handlers/files.js';

export const fileRoutes = express();

fileRoutes.use(bodyParser.json());                         // for parsing application/json
fileRoutes.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded

fileRoutes.get('/', handlers.getFiles);
fileRoutes.get('/folder', handlers.getFilesInFolder);
fileRoutes.post('/upload', handlers.uploadFile);
fileRoutes.patch('/rename', handlers.renameFile);
fileRoutes.delete('/delete', handlers.deleteFile);
fileRoutes.delete('/delete-bulk', handlers.deleteBulk);
