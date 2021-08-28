const express = require("express");
const router = express.Router();

const createRouter = require("./create");
const readRouter = require("./read");
const updateRouter = require("./update");

router.use(readRouter);
router.use(createRouter);
router.use(updateRouter);

module.exports = router;
