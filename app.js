const express = require('express');
const routes = require('./routes');
const ExpressError = require('./expressError');

const items = require('./fakeDb');

const app = express();

// this tells our application to parse incoming requests' body data with json
app.use(express.json());

// this applies the prefix "/items" to every route in routes.js
app.use("/items", routes);

// throw a generic 404 error if no routes match
app.use(function(req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError);
});

// general error handler
app.use(function(err, req, res, next) {

    // make default status 500: Internal Server Error
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    // alert the user
    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;