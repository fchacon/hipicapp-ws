"use strict";

const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8080;

const os = require("os");
const http = require("http");
const express = require("express");
const ApiConfig = require('./config/index');
const Routes = require("./routes/index");
const app = express();


ApiConfig.init(app);

Routes.init(app, express.Router());


http.createServer(app)
    .listen(ApiConfig.getEnv().PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${ApiConfig.getEnv().PORT}`);
      console.log(`environment: ${ApiConfig.getEnv().NODE_ENV}`);
    });
