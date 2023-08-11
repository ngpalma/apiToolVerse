const { User } = require("../db");
const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../libs/jwt");
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require("../config");
const { transport } = require('../utils/correo')

const register = async (req, res) => {
  const { email, password, firstName, lastName, role, phone } = req.body;

  try {
     console.log("Datos enviados en la solicitud REGISTER:", req.body);
    const userFound = await User.findOne({ where: { email } })
    if (userFound) return res.status(400).json({ message: "the email already exists" })
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
    res.cookie("token", token, {
      sameSite: 'none',
      secure: true
    });
    const contentHtml = `
  <h1>Bienvenido a Toolverse</h1>
  <p>Tu correo registrado es ${email}</p>
  `

    const mailOptions = {
      from: "Pagina de prueba",
      to: email,
      subject: "Nodemailer Prueba",
      html: contentHtml
    }
    const result = await transport.sendMail(mailOptions)
    console.log(result)
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
    console.log("Datos enviados en la solicitud LOGIN:", req.body);

    const userFound = await User.findOne({ where: { email } });

    if (!userFound) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ message: "User not found" });
    }

    if (userFound.passwordGoogle && password === "logingoogle") {
      // Usuario registrado con Google, verificamos la contraseña "logingoogle"
      const token = await createAccessToken({ id: userFound.id });
      console.log("Token generado:", token);

      res.cookie("token", token, {
        sameSite: 'none',
        secure: true
      });

      res.json({
        id: userFound.id,
        email: userFound.email,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        phone: userFound.phone,
        token: token // Asegurémonos de incluir el token en la respuesta JSON
      });
    } else {
      // Usuario no registrado con Google, verificamos la contraseña normalmente
      const isMatch = await bcrypt.compare(password, userFound.password);

      if (!isMatch) {
        console.log("Contraseña incorrecta");
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = await createAccessToken({ id: userFound.id });
      console.log("Token generado:", token);

      res.cookie("token", token, {
        sameSite: 'none',
        secure: true
      });

      res.json({
        id: userFound.id,
        email: userFound.email,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        phone: userFound.phone,
        token: token // Asegurémonos de incluir el token en la respuesta JSON
      });
    }

  } catch (error) {
    console.log("Error en el controlador de login:", error.message);
    res.status(500).json(error.message);
  }
};


const logout = (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  })
  return res.sendStatus(200)
}
const profile = async (req, res) => {
  const userFound = await User.findByPk(req.user.id)
  if (!userFound) return res.status(400).json({ message: "User not found" })
  return res.json({
    id: userFound.id,
    email: userFound.email,
  })
}

const verifyToken = async (req, res) => {
  const { token } = req.cookies

  if (!token) return res.status(401).json({ message: "Unauthorized" })

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" })
    const userFound = await User.findByPk(user.id)
    if (!userFound) return res.status(401).json({ message: "Unauthorized" })
    return res.json({
      id: userFound.id,
      email: userFound.email
    })
  })
}
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userFound = await User.findOne({ where: { email } });

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generar un token para restablecer la contraseña con vigencia de 1 hora
    const token = jwt.sign({ id: userFound.id }, TOKEN_SECRET, { expiresIn: '1h' });

    // Envía el correo con el enlace para restablecer la contraseña
    const resetLink = process.env.NODE_ENV === 'production'?`https://clienttoolverse-production.up.railway.app/password/${token}`:`http://localhost:3000/password/${token}`;
    const contentHtml = `
      <h1>Restablecer contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;
    const mailOptions = {
      from: "Pagina de prueba",
      to: email,
      subject: "Restablecer Contraseña - Toolverse",
      html: contentHtml
    };
    await transport.sendMail(mailOptions);

    res.json({ message: "Reset password link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const contactUs= async(req,res)=>{
  try {
    const {firstName,lastName,email,subject,message}=req.body
    const mailOptions = {
      from: email,
      to: "rojas650634@gmail.com",
      subject: subject,
      html: `
      <p>${firstName}</p>
      <p>${lastName}</p>
      <h1>${message}</h1>
      `
    };
    const result=await transport.sendMail(mailOptions);
    console.log(result)
    res.status(200).json({success:true})
  } catch (error) {
    res.status(402).json(error.message)
  }
 
}

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verificar el token
    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const userId = decodedToken.id;

    // Buscar al usuario por su ID
    const userFound = await User.findByPk(userId);

    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // Encriptar la nueva contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Actualizar la contraseña del usuario
    userFound.password = password_hash;
    await userFound.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  profile,
  verifyToken,
  forgotPassword,
  resetPassword,
  contactUs
};


// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log("Datos enviados en la solicitud LOGIN:", req.body);

//     const userFound = await User.findOne({ where: { email } });

//     if (!userFound) {
//       console.log("Usuario no encontrado");
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, userFound.password);
    
//     if (!isMatch) {
//       console.log("Contraseña incorrecta");
//       return res.status(400).json({ message: "Incorrect password" });
//     }

//     const token = await createAccessToken({ id: userFound.id });
//     console.log("Token generado:", token);

//     res.cookie("token", token, {
//       sameSite: 'none',
//       secure: true
//     });

//     res.json({
//       id: userFound.id,
//       email: userFound.email,
//       password: userFound.password,
//       firstName: userFound.firstName,
//       lastName: userFound.lastName,
//       phone: userFound.phone,
//       token: token // Asegurémonos de incluir el token en la respuesta JSON
//     });
//   } catch (error) {
//     console.log("Error en el controlador de login:", error.message);
//     res.status(500).json(error.message);
//   }
// };
