var express = require("express");
var router = express.Router();
var headerDecoder = require("../utils/decode_header");
const { body, param, validationResult } = require("express-validator");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const Tickets = require("../models/tickets.model").model;
const ticketsService = require("../services/tickets.service");
const Users = require("../models/users.model").model;

router.get("/", async function (req, res, next) {
  let decodedHeader;

  try {
    decodedHeader = headerDecoder(req.headers.authorization);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send("Invalid headers");
  }

  if (decodedHeader.email === "admin" && decodedHeader.outlookId === "admin") {
    const tickets = await Tickets.find().exec();
    return res.status(StatusCodes.ACCEPTED).json(tickets);
  } else {
    let userExist = await Users.exists({ email: decodedHeader.email });

    if (userExist == null) {
      return res.status(StatusCodes.NOT_FOUND).send("This user doesn't exist");
    }

    const tickets = await ticketsService.getTickets(decodedHeader.email);

    return res.status(StatusCodes.ACCEPTED).json(tickets);
  }
});

router.get("/:id", param("id").isLength(5), async function (req, res, next) {
  let decodedHeader;

  try {
    decodedHeader = headerDecoder(req.headers.authorization);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send("Invalid headers");
  }

  if (decodedHeader.email != "admin" && decodedHeader.outlookId != "admin") {
    let userExist = await Users.exists({ email: decodedHeader.email });

    if (userExist == null) {
      return res.status(StatusCodes.NOT_FOUND).send("This user doesn't exist");
    }
  }

  const ticket = await ticketsService.getTicketById(req.params.id);

  return res.status(StatusCodes.ACCEPTED).json(ticket);

});

router.post(
  "/",
  body("title").notEmpty(),
  body("description").notEmpty(),
  body("targetEmails").notEmpty(), // each email separated by ','
  body("pictureUrl"),
  async function (req, res, next) {
    let decodedHeader;

    try {
      decodedHeader = headerDecoder(req.headers.authorization);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid headers");
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        errors: `${errors.array()[0].param} should not be empty`,
      });
    }

    if (
      decodedHeader.email === "admin" &&
      decodedHeader.outlookId === "admin"
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Admin is not allowed to create users");
    }

    let userExist = await Users.exists({ email: decodedHeader.email });

    if (userExist == null) {
      return res.status(StatusCodes.NOT_FOUND).send("This user doesn't exist");
    }



    try {
      const ticket = await ticketsService.createTickets(
        decodedHeader.email,
        req.body.title,
        req.body.description,
        req.body.targetEmails,
        req.body.pictureUrl
      );
      return res.status(StatusCodes.CREATED).json(ticket);
    } catch (error) {
      console.log(error);
      console.log(req.body);
      return res.status(StatusCodes.EXPECTATION_FAILED).json(error);
    }
  }
);

router.post(
  "/:id/comment",
  param("id").isLength(5),
  body("content").notEmpty(),
  body("pictureUrl"),
  async function (req, res, next) {
    let decodedHeader;

    try {
      decodedHeader = headerDecoder(req.headers.authorization);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid headers");
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        errors: errors.array(),
      });
    }

    if (
      decodedHeader.email != "admin" &&
      decodedHeader.outlookId != "admin"
    ) {
      let userExist = await Users.exists({ email: decodedHeader.email });

      if (userExist == null) {
        return res.status(StatusCodes.NOT_FOUND).send("This user doesn't exist");
      }
    }

    const sender = decodedHeader.email
    try {
      const ticket = await ticketsService.addCommentToTicket(req.params.id, decodedHeader.email, req.body.content, req.body.pictureUrl,);
      if (ticket == null) {
        return res.status(StatusCodes.BAD_REQUEST).send("This ticket is already closed")
      }
      return res.status(StatusCodes.CREATED).json(ticket);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(error);
    }


  }
);

router.patch(
  "/:id/close",
  param("id").notEmpty().isLength(6),
  async function (req, res, next) {
    let decodedHeader;

    try {
      decodedHeader = headerDecoder(req.headers.authorization);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid headers");
    }

    if (decodedHeader.email != "admin" && decodedHeader.outlookId != "admin") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Only admin is allowed to close tickets");
    }

    const ticket = await ticketsService.closeTicketById(req.params.id);

    if (ticket == null) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Ticket already closed");
    }
    return res.status(StatusCodes.ACCEPTED).json(ticket);
  }
);

router.delete("/", async function (req, res, next) { });

module.exports = router;
