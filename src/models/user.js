const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordService = require("../services/password");

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/gm, "\n");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.isAdmin;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await passwordService.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.methods.checkPassword = async function (suppliedPassword) {
  const isValid = await passwordService.compare(
    this.password,
    suppliedPassword
  );
  return isValid;
};

userSchema.methods.generateAuthToken = async function () {
  return new Promise((resolve, reject) => {
    const payload = { id: this._id };
    if (this.isAdmin) payload.isAdmin = this.isAdmin;

    jwt.sign(
      payload,
      jwtPrivateKey,
      {
        expiresIn: "10d",
        algorithm: "RS256",
      },
      (err, token) => {
        if (err) return reject(err);
        else return resolve(token);
      }
    );
  });
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(1028).required(),
  });

  return schema.validateAsync(user);
}

module.exports = { User, validateUser };
