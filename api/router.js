let router = require("express").Router();

const user=require('../api/controller/user')

router.post("/signup", user.signup);
router.post("/updatepassword", user.updatePassword);

module.exports=router
