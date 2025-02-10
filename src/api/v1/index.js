/** **********
 * REQUIRES *
 *********** */

// Routing
const express = require('express');

const app = express();

/** *****************
 * EXTERNAL ROUTES *
 ****************** */

// Public
const publicEndpoints = require('./public/index.js');

app.use('/', publicEndpoints);

module.exports = app;
