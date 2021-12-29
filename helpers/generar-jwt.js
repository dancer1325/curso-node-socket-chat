const jwt = require('jsonwebtoken');
const { Usuario } = require('../models')



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        // Generate JWT, based on the uid and a secret
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' // Valid time previous to expire this JWT generated
        }, ( err, token ) => { // 1º argument is always the error, 2º argument is always the JWT generated

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token ); // Continue with the execution
            }
        })

    })
}

// Similar logic to the curso-node-restserver, but here handling the "error" returning a null
const comprobarJWT = async( token = '') => {

    try {
        
        if(  token.length < 10 ) { // TODO: Why this restriction?
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); // Verify the token, and destructuring
        const usuario = await Usuario.findById( uid );

        if ( usuario ) {
            if ( usuario.estado ) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }

}




module.exports = {
    generarJWT,
    comprobarJWT
}

