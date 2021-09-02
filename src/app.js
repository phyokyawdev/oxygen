const express = require("express");
require("express-async-errors");
const passport = require("passport");
const cookieSession = require("cookie-session");

const { NotFoundError } = require("@shared/errors");
const { errorHandler } = require("@shared/middlewares");
const v1Router = require("./routes/v1");

const cookieKeys = process.env.COOKIE_KEYS.split(",");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: cookieKeys,
  })
);

// configure passport
passport.initialize();
require("./config/passport");

app.get("/", (req, res) => {
  res.send("Hello World");
});

// routers
app.use("/v1", v1Router);

// handler for unknown routes
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
