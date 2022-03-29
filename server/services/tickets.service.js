const Tickets = require("../models/tickets.model").model;
const Comments = require("../models/comments.model").model;
const makeId = require("../utils/random_id");
const TicketStatus = require("../shared/ticket_status.enum");
const mailService = require('./mail.service');

async function getTickets(email) {
  const tickets = await Tickets.find({ email: email }).sort({ updatedAt: 'desc' }).exec();

  return tickets;
}

async function getTicketById(id) {
  const tickets = await Tickets.findOne({ id: id }).exec();

  return tickets;
}

async function createTickets(email, title, description, targetEmails, pictureUrl) {
  const ticketId = makeId(5);

  const ticketExist = await Tickets.exists({ id: ticketId });

  if (ticketExist != null) {
    ticketExist = makeId(5);
  }

  try {
    const ticket = await new Tickets({
      id: makeId(5),
      email: email,
      title: title,
      description: description,
      targetEmails: targetEmails,
      pictureUrl: pictureUrl,
      status: TicketStatus.pending
    }).save();

    const user = email.split('@')[0].split('.').join(' ');
    mailService.sendCcMail(targetEmails, `New ticket add by ${user}`, `
    ${user} create a new ticket about <i>${title}</i> assigned to your department. Please, you can have a look to this with this link <a href="${process.env.FRONTEND_URL}/comments/${ticket.id}">${process.env.FRONTEND_URL}/comments/${ticket.id}</a>
  `);

    console.log(`A new comment added for ${email}`);
    return ticket;
  } catch (error) {
    throw new Error(error);
  }
}

async function closeTicketById(id) {
  let ticket = await Tickets.findOne({ id: id }).exec();

  if (ticket.status == TicketStatus.closed) {
    return null;
  }

  await ticket.updateOne({ status: TicketStatus.closed });

  ticket = await Tickets.findOne({ id: id }).exec();

  mailService.sendMail(ticket.email, `Your ticket has been closed by Admin`, `
        Your ticket about <i>${ticket.title}</i> has been closed by your Admin</a>
  `,);

  return ticket;
}

function deleteTickets() { }

async function addCommentToTicket(id, sender, content, pictureUrl) {
  let ticket = await Tickets.findOne({ id: id }).exec();

  if (ticket.status == TicketStatus.pending) {
    await ticket.updateOne({ status: TicketStatus.processing });
    ticket = await Tickets.findOne({ id: id }).exec();
  } else if (ticket.status == TicketStatus.closed) {
    return null;
  }

  let comment = { ticketId: id, sender: sender, content: content, pictureUrl: pictureUrl };

  const newComment = new Comments(comment);

  ticket.comments.push(comment);

  ticket = await ticket.save();

  if (sender === 'admin')
    mailService.sendMail(ticket.email, `A new comment has been added by Admin`, `
  A new comment had been added by your admin for your ticket <i>${ticket.title}</i></a>
`,);
  await newComment.save();


  return ticket;
}

module.exports = {
  getTickets,
  getTicketById,
  deleteTickets,
  createTickets,
  closeTicketById,
  addCommentToTicket,
};
