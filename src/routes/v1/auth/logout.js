const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  // set auth token to null
  req.session = null;

  res.send({});
});

module.exports = router;
