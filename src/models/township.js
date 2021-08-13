const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.region;
        delete ret.__v;
      },
    },
  }
);

const Township = mongoose.model("Township", schema);

module.exports = { Township };
