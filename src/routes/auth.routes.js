const {Router} =require('express')
const { register, login, logout, profile, verifyToken, forgotPassword, resetPassword, contactUs } = require('../controllers/auth.controller')
const { authRequired } = require('../middlewares/validateToken')
const { OAuth2Client } = require('google-auth-library');
const { User } = require("../db");
const { createAccessToken } = require("../libs/jwt");

const router =Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/forgotPassword',forgotPassword)
router.post('/resetPassword/:token',resetPassword)
router.post('/contactUs',contactUs)
router.get("/verify", verifyToken)
router.get("/profile",authRequired, profile)


// Nueva ruta para autenticación con Google
router.post('/login/google', async (req, res) => {
  const { googleToken } = req.body;

  const client = new OAuth2Client("770412625356-vul6o4cnqq4bj7j3klkh3qf69bbom7lv.apps.googleusercontent.com"); // CLIENT_ID

  try {
    // Verificar el token de Google y obtener la información del usuario
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: "770412625356-vul6o4cnqq4bj7j3klkh3qf69bbom7lv.apps.googleusercontent.com", // CLIENT_ID
    });
    const payload = ticket.getPayload();

    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;

    // Verificar si el correo electrónico ya está registrado en tu base de datos
    const userFound = await User.findOne({ where: { email } });

    if (userFound) {
      // Realizar la autenticación (inicio de sesión)
      const token = await createAccessToken({ id: userFound.id });
      console.log("Token generado:", token);

      res.cookie("token", token, {
        sameSite: 'none',
        secure: true
      });

      res.json({ token });
    } else {
      // Realizar el registro automático
      const password = generateRandomPassword(); // Genera una contraseña aleatoria
      const password_hash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: password_hash,
        firstName,
        lastName,
      });

      const token = await createAccessToken({ id: newUser.id });
      console.log("Token generado:", token);

      res.cookie("token", token, {
        sameSite: 'none',
        secure: true
      });

      res.json({ token });
    }
  } catch (error) {
    console.error("Error en la autenticación con Google:", error);
    res.status(500).json({ message: "Error en la autenticación con Google" });
  }
});

module.exports = router;
