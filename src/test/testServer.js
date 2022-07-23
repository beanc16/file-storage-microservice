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
const {
    Success,
    InternalServerError,
} = require("dotnet-responses");


// Sending images
const axios = require("axios");





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

app.post("/upload", function(req, res)
{
    const data = {
        app: {
            id: "62cb9241e5a1b7985677ebfe",
            searchName: "file-storage-microservice"
        },
        file: {
            dataUri: require("image-to-uri")("uploads/capoo-bugcat.gif"),
            fileName: "capoo-bugcat",
            //fileName: "bugcatStareRight",
            //url: "https://cdn.discordapp.com/emojis/927237004469628988.png",
        },
    };

    axios.post("http://localhost:8002/api/v1/files/upload", data)
    .then(function (response)
    {
        Success.json({
            res,
            data: response.data.data,
            message: response.data.message,
        });
    })
    .catch(function (err)
    {
        InternalServerError.json({
            res,
            ...err.response.data,
        });
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