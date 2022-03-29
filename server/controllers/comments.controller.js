var express = require('express');
var router = express.Router();
const headerDecoder = require("../utils/decode_header");
const { body, param, validationResult } = require("express-validator");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const Users = require("../models/users.model").model;
const commentsService = require("../services/comments.service");

//TODO: End with comments
router.get('/', function (req, res, next) {

});

router.get('/:ticketId', param("ticketId").notEmpty().isLength(6), async function (req, res, next) {
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
    
    try {
        const comments = await commentsService.getCommentsByTicketId(req.params.ticketId);
        return res.status(StatusCodes.ACCEPTED).json(comments);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send("An error occured");
    }

});

router.delete('/', function (req, res, next) {

});

module.exports = router;