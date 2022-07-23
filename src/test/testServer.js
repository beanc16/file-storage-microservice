/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();


// CORS
const cors = require("cors");
app.use(cors());


// Response
const { Success } = require("dotnet-responses");


// Sending images
const axios = require("axios");
const FormData = require("form-data");





/********
 * GETS *
 ********/

app.get("/ping", function(req, res)
{
    Success.json({
        res,
        message: "Pong",
    });
});





/*********
 * POSTS *
 *********/

app.post("/upload-url", function(req, res)
{
    //axios.post
    Success.json({
        res,
        message: "Pong",
    });
});





/********
 * PORT *
 ********/

app.listen(7999, async function (err)
{
    if (err) console.error("Error in server setup", err);
    console.info(`App listening on port 7999`);
});