const nodemailer = require("nodemailer")

  // transport.verify().then(()=>{
  //   console.log("Ready For  send email")
  // })

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:465,
    secure:true,
    auth: {
    user: "rojas650634@gmail.com",
    pass:"mlslvbaeiashpmos"
    }
})



  module.exports={
    transport
  }