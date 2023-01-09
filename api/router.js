const user=require('../api/controller/user')
let router = require("express").Router();

router.post("/signup", user.signup);
router.post("/updatepassword", user.updatePassword);

module.exports=router
