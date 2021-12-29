const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();


const socketController = async( socket = new Socket(), io ) => { //Work either own socket received or this.io
    // new Socket()  isn't a good approach, and just to use the received socket object. Advantages is that you can see the suggestions

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']); // handshake is the agreement at the beginning of the Socket session
    if ( !usuario ) {
        return socket.disconnect(); // Disconnect the namespace
    }

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos',     chatMensajes.usuariosArr ); // Since it's io --> It will be launched to all clients connected to the server via socket
    socket.emit('recibir-mensajes', chatMensajes.ultimos10 ); // It will launch the event and it will be listened just by the client which triggers the call to the server

    // Conectarlo a una sala especial -- Group the sockets
    socket.join( usuario.id ); // global, socket.id, usuario.id
    

    // Limpiar cuando alguien se desconeta
    socket.on('disconnect', () => { // Socket to listen on 'disconnect' event. This event is launched each time a client disconnects . Example : Refreshing a webpage
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr ); // Since it's io --> It will be launched to all clients connected to the server via socket
    })

    socket.on('enviar-mensaje', ({ uid, mensaje }) => { // Socket to listen on 'enviar-mensaje' event
        
        if ( uid ) {
            // Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje }); // .to(room) -- Set a modifier for a room --
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10 ); // Since it's io --> It will be launched to all clients connected to the server via socket
        }

    })

    
}



module.exports = {
    socketController
}