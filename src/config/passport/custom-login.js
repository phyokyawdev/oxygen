const passport = require("passport");
const { Strategy } = require("passport-custom");

const { User } = require("../../models/user");

passport.use(
  "login",
  new Strategy(async (req, cb) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return cb(null, false, {
          message: "Invalid credentials",
        });
      }

      const validPassword = await user.checkPassword(password);
      if (!validPassword) {
        return cb(null, false, {
          message: "Invalid credentials",
        });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);
