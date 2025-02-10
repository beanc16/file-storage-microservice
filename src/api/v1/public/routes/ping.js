const { Success } = require('dotnet-responses');
const express = require('express');

const app = express();

app.get('/', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

module.exports = app;
