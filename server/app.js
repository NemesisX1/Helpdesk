const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
require('dotenv').config()

const mongoose = require("mongoose");
const User = require('./models/users.model')

const port = process.env.PORT || 8081;
const host = "0.0.0.0";
const database = require("./config/database");

const indexRouter = require("./controllers/index");
const usersController = require("./controllers/users.controller");
const ticketsController = require("./controllers/tickets.controller");
const commentsController = require("./controllers/comments.controller");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/users", usersController);
app.use("/tickets", ticketsController);
app.use("/comments", commentsController);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
  .connect(database.cloud_url)
  .then(async () => {
    app.listen(port, host, () => {
      console.log(`Server running on http://localhost:${port}`);
    }
    );
  })
  .catch((error) => {
    console.log(error);
    throw error;
  });
module.exports = app;
