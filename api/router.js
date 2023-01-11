const user=require('../api/controller/user')
let router = require("express").Router();

router.post("/signup", user.signup);
router.post("/updatepassword", user.updatePassword);
router.post("/forgotpasswordmail",user.forgetPasswordMail)
module.exports=router
