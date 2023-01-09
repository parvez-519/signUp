const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appConst=require('../constants')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
  try {
    const userData = JSON.parse(JSON.stringify(req.body));
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.token = jwt.sign(
      { name: userData.firstname + userData.lastname, date: new Date() },
      "mysterytoken"
    );
    console.log("--------->>>>>",userData)
    const resp = await prisma.user.create(userData);
    res.status(201).json({
      status: appConst.status.success,
      response: resp,
      message: "User Creation Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: error.message,
    });
  }
};


const updatePassword = async (req, res) => {
    try {
      const user = JSON.parse(JSON.stringify(req.body));
      user.password = await bcrypt.hash(password, 10);
      user.token = jwt.sign(
        { name: user.firstname + user.lastname, date: new Date() },
        "mysterytoken"
      );
      const resp = await userRepo.save(user);
      res.status(201).json({
        status: appConst.status.success,
        response: resp,
        message: "User Creation Successfully",
      });
    } catch (error) {
      console.log(err);
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: err.message,
      });
    }
  };

module.exports={signup,updatePassword}