import express from 'express';

import { fileRoutes } from './routes/files.js';
import { healthCheckRoutes } from './routes/healthCheck.js';

export const v1Routes = express();

v1Routes.use('/ping', healthCheckRoutes);
v1Routes.use('/files', fileRoutes);
