var elasticemail = require('elasticemail');
// var elasticemail = require("elastic-email");

// 164D3587A2F28EF86F3B954B4DA8DEF28A84

var client = elasticemail.createClient({
  username: 'prk03696@gmail.com',
  apiKey: '164D3587A2F28EF86F3B954B4DA8DEF28A84'
});
 
var msg = {
  from: 'prk03696@gmail.com',
  from_name: 'Parvez Pathan',
  to: 'parvez.pathan@TECTORO.COM',
  subject: 'Hello',
  body_text: 'Hi , This mail is regarding forgot password'
};
 
client.mailer.send(msg, function(err, result) {
  if (err) {
    return console.error(err);
  }
 
});


const sendForgetPasswordMail = (token, userName, user) => {
    console.log("--send pwd mail----",userName)
    // let output = template.forgotPwdTemplate(token, user);
    let mailOptions = {
      to: userName,
      subject: "Forgot Password", 
      text: "Please reset your password"
     
    };
    console.log("----hi--------")
    client.mailer.send(mailOptions, (error, info) => {
      if (error) {
        return error;
      }
      return { message: "email is sent" };
    });
  };
  module.exports={sendForgetPasswordMail}

