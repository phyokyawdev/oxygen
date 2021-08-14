const express = require("express");
const router = express.Router({ mergeParams: true });

const readRouter = require("./read");

router.use("/townships", [readRouter]);

module.exports = router;
