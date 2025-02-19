import { express as expressLogging, logger } from '@beanc16/logger';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { errorRoutes } from './src/all/routes/errors.js';
import { v1Routes } from './src/v1/index.js';

// Setup
const { errorHandler, logEndpointDuration } = expressLogging;

dotenv.config();

const app = express();
app.use(cors());

const apiPrefix = 'api';

// Starting Middleware
app.use((req, res, next) => logEndpointDuration(req, res, next, logger));

// Routes
app.use(`/${apiPrefix}/v1`, v1Routes);
app.use('/', errorRoutes);

// Ending Middleware
app.use((
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => errorHandler(err, req, res, next));

// Start server
app.listen(process.env.PORT, () =>
{
    logger.info(`App listening on port ${process.env.PORT}`);
});
