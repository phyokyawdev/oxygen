const express = require("express");
const router = express.Router();

const loginRouter = require("./login");
const logoutRouter = require("./logout");
const signupRouter = require("./signup");
const meRouter = require("./me");

router.use("/auth", [loginRouter, logoutRouter, signupRouter, meRouter]);

module.exports = router;
