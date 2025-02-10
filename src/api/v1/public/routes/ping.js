/** **********
 * REQUIRES *
 *********** */

// Routing
const express = require('express');

const app = express();

// Response
const { Success } = require('dotnet-responses');

/** ******
 * GETS *
 ******* */

app.get('/', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *******
 * POSTS *
 ******** */

app.post('/', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *****
 * PUT *
 ****** */

app.put('/', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *********
 * PATCHES *
 ********** */

app.patch('/', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *********
 * DELETES *
 ********** */

app.delete('/', (_req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

module.exports = app;
