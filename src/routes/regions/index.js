const express = require("express");
const router = express.Router();

const readRouter = require("./read");

router.use("/regions", [readRouter]);

module.exports = router;
