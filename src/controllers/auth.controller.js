const { User } = require("../db");
const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../libs/jwt");
const jwt=require('jsonwebtoken');
const { TOKEN_SECRET } = require("../config");
const nodemailer=require("nodemailer")
const {google}=require("googleapis")

const CLIENT_ID="863750473318-kvh4uiflolu31cfo3eroaa8lskepul08.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REDIRECT_URI="https://developers.google.com/oauthplayground"
const REFRESH_TOKEN="1//04yFomw_XoiMaCgYIARAAGAQSNwF-L9IrDo1v4oHXy4Wer4t2s7x3vDv5noC2ebO8SnNerpmHpU7NfCt8N8HNtDJDvP9neCfr7ZI"

const register = async (req, res) => {
  const { email, password, firstName, lastName, role, phone } = req.body;

  try {
    const userFound=await User.findOne({where:{email}})
    if(userFound) return res.status(400).json({message:"the email already exists"})
    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: password_hash,
      firstName,
      lastName,
      role,
      phone,
    });
    const userSaved = await user.save();
    const token = await createAccessToken({ id: userSaved.id });
    res.cookie("token", token);
    
    const oAuth2Client= new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
    oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

    const contentHtml=`
    <h1>Bienvenido a Toolverse</h1>
    <p>Tu correo registrado es ${email}</p>
    `
    const accesesToken=await oAuth2Client.getAccessToken()
    const transport=nodemailer.createTransport({
      service:"gmail",
      auth:{
        type:"OAuth2",
        user:"rojas650634@gmail.com",
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken:accesesToken
      }
    })
    const mailOptions={
      from:"Pagina de prueba",
      to:email,
      subject:"Nodemailer Prueba",
      html:contentHtml
    }
    const result=await transport.sendMail(mailOptions)
    res.json({
      id: userSaved.id,
      email: userSaved.email,
      password: userSaved.password,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ where:{email} });

    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound.id });
    res.cookie("token", token);
    res.json({
      id: userFound.id,
      email: userFound.email,
      password: userFound.password,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const logout=(req,res)=>{
  res.cookie('token',"",{
    expires: new Date(0)
  })
  return res.sendStatus(200)
}
const profile=async(req,res)=>{
  const userFound=await User.findByPk(req.user.id)
  if(!userFound) return res.status(400).json({message:"User not found"})
  return res.json({
    id:userFound.id,
    email:userFound.email,
  })
}

const verifyToken=async(req, res) => {
  const {token}=req.cookies

  if(!token) return res.status(401).json({message:"Unauthorized"})
  
  jwt.verify(token,TOKEN_SECRET,async (err,user)=>{
    if(err) return res.status(401).json({message:"Unauthorized"})
    const userFound=await User.findByPk(user.id)
    if(!userFound) return res.status(401).json({message:"Unauthorized"})
    return res.json({
      id:userFound.id,
      email:userFound.email
    })
  })
}

module.exports = {
  register,
  login,
  logout,
  profile,
  verifyToken
};
