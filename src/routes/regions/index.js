const express = require("express");
const router = express.Router();

const readRouter = require("./read");

router.use(readRouter);

module.exports = router;
