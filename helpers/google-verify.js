const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

const googleVerify = async( idToken = '' ) => {

  const ticket = await client.verifyIdToken({
      idToken,
      // audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      requiredAudience: process.env.GOOGLE_CLIENT_ID,
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const { name: nombre, // Rename th properties, such as map them
          picture: img, 
          email: correo
        } = ticket.getPayload(); // Destructure getting the required information from Google Identification
  
  return { nombre, img, correo };

}


module.exports = {
    googleVerify
}