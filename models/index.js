

const Categoria    = require('./categoria');
const ChatMensajes = require('./chat-mensajes')
const Producto = require('./producto');
const Role     = require('./role');
const Server   = require('./server');
const Usuario  = require('./usuario');


// Export all the models
module.exports = {
    Categoria,
    ChatMensajes,
    Producto,
    Role,
    Server,
    Usuario,
}

