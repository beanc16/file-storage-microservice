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

app.get('/*', (_req, res) =>
{
    InvalidUrl.json({ res });
});

/** *******
 * POSTS *
 ******** */

app.post('/*', (_req, res) =>
{
    InvalidUrl.json({ res });
});

/** *****
 * PUT *
 ****** */

app.put('/*', (_req, res) =>
{
    InvalidUrl.json({ res });
});

/** *********
 * PATCHES *
 ********** */

app.patch('/*', (_req, res) =>
{
    InvalidUrl.json({ res });
});

/** *********
 * DELETES *
 ********** */

app.delete('/*', (_req, res) =>
{
    InvalidUrl.json({ res });
});

module.exports = app;
