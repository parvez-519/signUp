const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appConst = require("../constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const userData = JSON.parse(JSON.stringify(req.body));
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!userData.password.match(regex)) {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: "Password requirement not matched",
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
        message: "SignUp Successfully",
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
        await bcrypt.compare(userData.currentPassword,currentUser.password)
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
            message: "Password requirement not matched",
          });
          return;
        }
      }
    } else {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: "User not found",
      });
      return;
    }
    res.status(201).json({
      status: appConst.status.success,
      response: null,
      message: " Password successfully changed",
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

module.exports = { signup, updatePassword };
