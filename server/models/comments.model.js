var mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pictureUrl: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = {
  model: mongoose.model("Comments", CommentSchema),
  schema:  CommentSchema,
};
