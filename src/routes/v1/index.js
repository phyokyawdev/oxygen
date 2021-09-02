const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const regionRouter = require("./regions");
const townshipRouter = require("./townships");
const plantRouter = require("./plants");

router.use("/auth", authRouter);
router.use("/regions", regionRouter);
router.use("/regions/:regionId/townships", townshipRouter);
router.use("/plants", plantRouter);

module.exports = router;
