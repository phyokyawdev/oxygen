const express = require("express");
const router = express.Router();

const readRouter = require("./read");
const townshipRouter = require("../townships");

router.use("/regions", [readRouter]);
router.use("/regions/:regionId/", townshipRouter);

module.exports = router;
