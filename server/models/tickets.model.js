var mongoose = require("mongoose");
const Comments = require("./comments.model");
const TicketStatus = require("../shared/ticket_status.enum");

const TicketSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    targetEmails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: TicketStatus.pending,
      required: false,
    },
    pictureUrl: {
      type: String,
      required: false,
    },
    comments: [Comments.schema],
  },
  { timestamps: true }
);

module.exports = {
  model: mongoose.model("Tickets", TicketSchema),
  schema: TicketSchema,
};
