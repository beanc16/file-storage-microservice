/************
 * REQUIRES *
 ************/


// Routing
const express = require("express");
const app = express();





/*******************
 * EXTERNAL ROUTES *
 *******************/

// Public
const publicEndpoints = require("./public");
app.use(`/`, publicEndpoints);

// Private
const privateEndpoints = require("./private");
app.use(`/private`, privateEndpoints);





/********************
 * ERROR MIDDLEWARE *
 ********************/

/*
app.use(function (err, req, res, next)
{
    // Error-handling middleware is defined last, after other app.use() and routes calls
    
    console.error(err);

    // Set auth0 access token on authorization error
    if (err && (
            (err.status && err.status === 401) ||
            (err.statusCode && err.statusCode === 401)
       ))
    {
        setAuth0AccessToken(); 
    }

    res.send(err);
});
*/





module.exports = app;
