const express = require("express");
const { app } = require("../server");

const jsonmiddleware = async (req, res, next) => {
    express.json()// Parse JSON data
    next()

}

module.exports = jsonmiddleware;