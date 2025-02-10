/** **********
 * REQUIRES *
 *********** */

// Routing
const express = require('express');

const app = express();

// Response
const { InvalidUrl } = require('dotnet-responses');

/** ******
 * GETS *
 ******* */

app.get('/*', (req, res) =>
{
    InvalidUrl.json({ res });
});

/** *******
 * POSTS *
 ******** */

app.post('/*', (req, res) =>
{
    InvalidUrl.json({ res });
});

/** *****
 * PUT *
 ****** */

app.put('/*', (req, res) =>
{
    InvalidUrl.json({ res });
});

/** *********
 * PATCHES *
 ********** */

app.patch('/*', (req, res) =>
{
    InvalidUrl.json({ res });
});

/** *********
 * DELETES *
 ********** */

app.delete('/*', (req, res) =>
{
    InvalidUrl.json({ res });
});

module.exports = app;
