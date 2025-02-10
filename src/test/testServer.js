/** **********
 * REQUIRES *
 *********** */

const { logger } = require('@beanc16/logger');

// Routing
const express = require('express');

const app = express();

// CORS
const cors = require('cors');

app.use(cors());

// Response
const { Success, InternalServerError } = require('dotnet-responses');

// Sending images
const axios = require('axios');

// Image to URI
const imageToUri = require('image-to-uri');

/** ******
 * GETS *
 ******* */

app.get('/ping', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *******
 * POSTS *
 ******** */

app.post('/upload', (_req, res) =>
{
    const data = {
        app: {
            id: '62cb9241e5a1b7985677ebfe',
            searchName: 'file-storage-microservice',
        },
        file: {
            dataUri: imageToUri('uploads/capoo-bugcat.gif'),
            fileName: 'capoo-bugcat',
            // fileName: "bugcatStareRight",
            // url: "https://cdn.discordapp.com/emojis/927237004469628988.png",
        },
    };

    axios.post('http://localhost:8002/api/v1/files/upload', data)
        .then((response) =>
        {
            Success.json({
                res,
                data: response.data.data,
                message: response.data.message,
            });
        })
        .catch((err) =>
        {
            InternalServerError.json({
                res,
                ...err.response.data,
            });
        });
});

/** ******
 * PORT *
 ******* */

app.listen(7999, (err) =>
{
    if (err) logger.error('Error in server setup', err);
    logger.info('App listening on port 7999');
});
