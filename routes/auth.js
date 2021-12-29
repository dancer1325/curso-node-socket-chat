const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT } = require('../middlewares');


const { login, googleSignin, renovarToken } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    // Will manage any post request which ends in '/login'
    check('correo', 'El correo es obligatorio').isEmail(), // Validation middlewares contained into express-validator
    check('password', 'La contraseña es obligatoria').not().isEmpty(), // Validation middlewares contained into express-validator
    validarCampos //Customize validation middleware
],login );

router.post('/google',[
    // Will manage any post request which ends in '/google'
    check('id_token', 'El id_token es necesario').not().isEmpty(), // Validation middlewares contained into express-validator
    validarCampos //Customize validation middleware
], googleSignin );

router.get('/', validarJWT, renovarToken );



module.exports = router;