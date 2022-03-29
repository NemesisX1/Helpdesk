var mongoose = require("mongoose");
const { model } = require("./comments.model");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    outlookId: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = {
  model: mongoose.model("Users", UserSchema),
  schema: UserSchema,
};