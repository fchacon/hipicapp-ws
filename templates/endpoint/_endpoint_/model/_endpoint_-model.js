"use strict";

const mongoose = require("mongoose");
const ApiConfig = require("./../../../config");

const __endpoint_Schema = {
    _endpoint_Message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
}

module.exports = mongoose.Schema(__endpoint_Schema);