const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares");

router.get("/me", auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;