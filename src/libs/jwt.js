const { TOKEN_SECRET } = require("../config");
const jwt=require('jsonwebtoken')

function createAccessToken(payload) {

    return new Promise(function(resolve, reject) {
        jwt.sign(
          payload,
          TOKEN_SECRET,
          {
            expiresIn: "1d",
          },
          (err, token) => {
            if (err) reject(err);
            resolve(token);
          }
        );
    })
}



module.exports={
    createAccessToken
}