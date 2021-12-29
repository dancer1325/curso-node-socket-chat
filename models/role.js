const { Schema, model } = require('mongoose');

// There is no property indicated as index
const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


module.exports = model( 'Role', RoleSchema );
