/************
 * REQUIRES *
 ************/

// Routing
const express = require("express");
const app = express();


// Response
const { InvalidUrl } = require("dotnet-responses");





/********
 * GETS *
 ********/

app.get("/*", function(req, res)
{
    InvalidUrl.json({ res });
});





/*********
 * POSTS *
 *********/

app.post("/*", function(req, res)
{
    InvalidUrl.json({ res });
});





/*******
 * PUT *
 *******/

app.put("/*", function(req, res)
{
    InvalidUrl.json({ res });
});





/***********
 * PATCHES *
 ***********/

app.patch("/*", function(req, res)
{
    InvalidUrl.json({ res });
});





/***********
 * DELETES *
 ***********/

app.delete("/*", function(req, res)
{
    InvalidUrl.json({ res });
});





module.exports = app;
