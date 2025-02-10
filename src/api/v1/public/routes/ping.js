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

app.get('/', (req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *******
 * POSTS *
 ******** */

app.post('/', (req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *****
 * PUT *
 ****** */

app.put('/', (req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *********
 * PATCHES *
 ********** */

app.patch('/', (req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

/** *********
 * DELETES *
 ********** */

app.delete('/', (req, res) =>
{
    Success.json({
        res,
        message: 'Pong',
    });
});

module.exports = app;
