import bodyParser from 'body-parser';
import express from 'express';

import * as handlers from '../handlers/files.js';

export const fileRoutes = express();

fileRoutes.get('/', handlers.getFiles);

fileRoutes.use(bodyParser.json());                         // for parsing application/json
fileRoutes.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded
