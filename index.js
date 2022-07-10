/************
 * REQUIRES *
 ************/

// Read environment variables
const dotenv = require("dotenv");
dotenv.config();


// Important variables
const { serverInfoEnum: serverInfo } = require("./src/js/enums");


// Routing
const express = require("express");
const app = express();


// CORS
const cors = require("cors");
app.use(cors());


// Swagger
/*
// TODO: Add swagger docs
const swaggerUi = require("swagger-ui-express");
const docs = require("./docs");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));
*/


// Custom variables
const apiPrefix = "api";





/*******************
 * EXTERNAL ROUTES *
 *******************/

// Api
const apiEndpoints = require("./src/api");
app.use(`/${apiPrefix}`, apiEndpoints);

// Errors
const errorEndpoints = require("./src/apiErrors");
app.use(`/`, errorEndpoints);





/********
 * PORT *
 ********/

app.listen(serverInfo.port, async function ()
{
  console.info("App listening on port " + serverInfo.port);
});
