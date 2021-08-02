const passport = require("passport");
const { Strategy } = require("passport-jwt");

const jwtPublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/gm, "\n");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.session) {
    token = req.session.jwt;
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtPublicKey,
  algorithms: ["RS256"],
};

passport.use(
  new Strategy(options, async (jwtPayload, done) => {
    try {
      const user = jwtPayload;
      if (!user) {
        return done(null, false, {
          message: "Invalid auth token",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
