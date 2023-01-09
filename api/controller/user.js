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
        { name: userData.firstname + userData.lastname, date: new Date() },
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
    // const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
    // const [email, password, changePassword] = Buffer.from(b64auth, "base64")
    //   .toString()
    //   .split(":");

    let currentUser = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    console.log(currentUser);
    if (currentUser) {
      console.log("00000000");
      console.log("-----", currentUser.password);
      console.log("-----", userData.currentPassword);
      console.log(await bcrypt.hash(userData.currentPassword, 10)),
      console.log(
        await bcrypt.compare(userData.currentPassword, currentUser.password)
      );
      if (
        await bcrypt.compare(userData.currentPassword,currentUser.password)
      ) {
        console.log("55555");

        if (userData.changePassword.match(regex)) {
          console.log("666666666");
          const encryptedPwd = await bcrypt.hash(userData.changePassword, 10);
          console.log(encryptedPwd);
          await prisma.user.update({
            where: { email: userData.email },
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
