const express = require("express");
require("express-async-errors");
const passport = require("passport");
const cookieSession = require("cookie-session");

const { NotFoundError } = require("@shared/errors");
const { errorHandler } = require("@shared/middlewares");

const authRouter = require("./routes/auth");
const regionRouter = require("./routes/regions");
const townshipRouter = require("./routes/townships");
const plantRouter = require("./routes/plants");

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
app.use("/auth", authRouter);
app.use("/regions", regionRouter);
app.use("/regions/:regionId/townships", townshipRouter);
app.use("/plants", plantRouter);

// handler for unknown routes
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
