const express = require("express");
const passport = require("passport");
const router = express.Router();

const { BadRequestError } = require("../../errors");
const { validateRequest } = require("../../middlewares");
const { validateUser } = require("../../models/user");

router.post("/signup", validateRequest.body(validateUser), (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
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

    res.status(201).send(user);
  })(req, res, next);
});

module.exports = router;
