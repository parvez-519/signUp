const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appConst = require("../constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mail = require("../../api/commonService/mail");

const signup = async (req, res) => {
  try {
    const userData = JSON.parse(JSON.stringify(req.body));
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!userData.password.match(regex)) {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: appConst.message.pwd_pattern,
      });
    } else {
      userData.password = await bcrypt.hash(userData.password, 10);
      userData.token = jwt.sign(
        { name: userData.username, date: new Date() },
        "mysterytoken"
      );
      console.log("--------->>>>>", userData);
      const resp = await prisma.user.create({ data: userData });
      res.status(201).json({
        status: appConst.status.success,
        response: resp,
        message: appConst.message.signup_success,
      });
    }
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
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const userData = JSON.parse(JSON.stringify(req.body));

    let currentUser = await prisma.user.findFirst({
      where: { userName: userData.userName },
    });
    console.log(currentUser);
    if (currentUser) {
      if (
        await bcrypt.compare(userData.currentPassword, currentUser.password)
      ) {
        if (userData.changePassword.match(regex)) {
          const encryptedPwd = await bcrypt.hash(userData.changePassword, 10);
          await prisma.user.update({
            where: { userName: userData.userName },
            data: { password: encryptedPwd },
          });
        } else {
          res.status(400).json({
            status: appConst.status.fail,
            response: null,
            message: appConst.message.pwd_pattern,
          });
          return;
        }
      }
    } else {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: appConst.message.user_not_found,
      });
      return;
    }
    res.status(201).json({
      status: appConst.status.success,
      response: null,
      message: appConst.message.pwd_successfully_changed,
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

const forgetPasswordMail = async (req, res) => {
  try {
    const userData = JSON.parse(JSON.stringify(req.body));

    const user = await prisma.user.findFirst({
      where: { userName: userData.userName },
    });
    console.log("------",user)
    if (userData) {
      const token = jwt.sign(
        {
          data: userData.userName,
        },
        "mysterytoken",
        {
          expiresIn: "30m",
        }
      );
      mail.sendForgetPasswordMail(token, userData.userName, user);
      // let record = await  prisma.user.update(userData.id, { resetPassword: true });

      res.status(200).json({
        status: appConst.status.success,
        response: null,
        message: "Email send successfully",
      });
    } else {
      res.status(400).json({
        message: "oops! looks like you need to register with us first!",
        status: appConst.status.fail,
        response: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).status({
      message: error.message,
      status: appConst.status.fail,
      response: null,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const userData = JSON.parse(JSON.stringify(req.body));
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    let currentUser = await prisma.user.findFirst({
      where: { userName: userData.userName },
    });
    if (currentUser) {
    } else {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: appConst.message.user_not_found,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: error.message,
    });
  }
};

module.exports = { signup, updatePassword, forgetPasswordMail, forgetPassword };
