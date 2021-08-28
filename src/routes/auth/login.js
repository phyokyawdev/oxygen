const express = require("express");
const passport = require("passport");
const router = express.Router();

const { BadRequestError } = require("@shared/errors");

router.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) return next(err);

    if (!user) return next(new BadRequestError(info.message));

    let token;
    try {
      token = await user.generateAuthToken();
    } catch (err) {
      return next(err);
    }

    // set auth token
    req.session = {
      jwt: token,
    };

    res.send(user);
  })(req, res, next);
});

module.exports = router;
