
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] // 2º argument is the error message
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true // Not accept duplicated properties. Indicate that this property is an index
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,  // URL with the image
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE'] // Validation about the possible values
    },
    estado: {  // Indicate if the user is enabled or not
        type: Boolean,
        default: true
    },
    google: {  // Indicate if the user login in with the google sign in
        type: Boolean,
        default: false
    },
});



UsuarioSchema.methods.toJSON = function() { // Add functionality to the schemas, overriding toJSON method
    const { __v, password, _id, ...usuario  } = this.toObject(); // "this" only works in "normal" functions, not in "arrow" functions
    // this.toObject returns the literal javascript object
    // Destructuring to take out __v and password, outside the rest
    usuario.uid = _id;// Switch the name of the property "_id" --> "uid" used each time that this method is invoked
    return usuario; // --> It won't return neither __v nor password
}

module.exports = model( 'Usuario', UsuarioSchema );
