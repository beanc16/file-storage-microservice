/** **********
 * REQUIRES *
 *********** */

// Telemetry
const { logger, express: { errorHandler, logEndpointDuration } } = require('@beanc16/logger');

// Read environment variables
const dotenv = require('dotenv');

dotenv.config();

// Routing
const express = require('express');

const app = express();

// CORS
const cors = require('cors');

app.use(cors());

// Important variables
const { serverInfoEnum: serverInfo } = require('./js/enums/index.js');

// Swagger
/*
// TODO: Add swagger docs
const swaggerUi = require("swagger-ui-express");
const docs = require("./docs");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
*/

// Custom variables
const apiPrefix = 'api';

/** ******************
 * START MIDDLEWARE *
 ******************* */

app.use((req, res, next) => logEndpointDuration(req, res, next));

/** *****************
 * EXTERNAL ROUTES *
 ****************** */

// Api
const apiEndpoints = require('./api/index.js');

app.use(`/${apiPrefix}`, apiEndpoints);

// Errors
const errorEndpoints = require('./all/routes/errors.js');

app.use('/', errorEndpoints);

/** ****************
 * END MIDDLEWARE *
 ***************** */

app.use((err, req, res, next) => errorHandler(err, req, res, next));

/** ******
 * PORT *
 ******* */

app.listen(serverInfo.port, (err) =>
{
    if (err) logger.error('Error in server setup', err);
    logger.info(`App listening on port ${serverInfo.port}`);
});
