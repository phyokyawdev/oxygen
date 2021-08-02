const passport = require("passport");
const { Strategy } = require("passport-custom");

const { User } = require("../../models/user");

passport.use(
  "signup",
  new Strategy(async (req, cb) => {
    try {
      const { userName, email, password } = req.body;

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return cb(null, false, {
          message: "Email already registered, Log in instead",
        });
      }

      const existingUserName = await User.findOne({ userName });
      if (existingUserName) {
        return cb(null, false, {
          message: "Username already exists, please try another",
        });
      }

      // create user
      const user = new User({ userName, email, password });
      await user.save();

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);
