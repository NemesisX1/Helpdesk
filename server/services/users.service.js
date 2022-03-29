const Users = require("../models/users.model").model;

async function createUser(email, name, outlookId) {
  try {
    let newUser = new Users({
      name: name,
      email: email,
      outlookId: outlookId,
    });
    newUser = await newUser.save();
    return newUser;
    
  } catch (error) {
    console.log("Error on createUser service " + error);
    throw new Error(error);
  }
}

async function getUser(email, outlookId) {
  const user = await Users.findOne({
    email: email,
    outlookId: outlookId,
  }).exec();
  return user;
}

function deleteUser() { }


module.exports = {
  createUser,
  deleteUser,
  getUser,
};
