var express = require("express");
var router = express.Router();
var headerDecoder = require("../utils/decode_header");
const { body, validationResult } = require("express-validator");
const {
  StatusCodes,
  getReasonPhrase,

} = require("http-status-codes");

const Users = require("../models/users.model").model;
const userService = require("../services/users.service");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let decodedHeader;

  try {
    decodedHeader = headerDecoder(req.headers.authorization);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send("Invalid headers");
  }

  if (decodedHeader.email === "admin" && decodedHeader.outlookId === "admin") {
    const users = await Users.find().exec();
    return res.status(StatusCodes.ACCEPTED).json(users);
  } else {
    const user = await userService.getUser(
      decodedHeader.email,
      decodedHeader.outlookId
    );

    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).send("This user doesn't exist");
    }
    return res.status(StatusCodes.ACCEPTED).json(user);
  }
});

router.post(
  "/",
  body("email").isEmail(),
  body("name").notEmpty(),
  body("outlookId").notEmpty(),
  async function (req, res, next) {
    
    try {
      const decodedHeader = headerDecoder(req.headers.authorization);
      if (
        decodedHeader.email === "admin" &&
        decodedHeader.outlookId === "admin"
      ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send("Admin is not allowed to create users");
      }
    } catch (e) {

    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        errors: errors.array(),
      });
    }

    let userExist = await Users.exists({ email: req.body.email });

    if (userExist != null) {
      console.log("User already exist ");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("This user email already exists");
    }

    try {
      const user = await userService.createUser(
        req.body.email,
        req.body.name,
        req.body.outlookId
      );

      return res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      console.log("Error on created user request " + error);
      return res.status(StatusCodes.EXPECTATION_FAILED).json(error);
    }
  }
);

module.exports = router;
