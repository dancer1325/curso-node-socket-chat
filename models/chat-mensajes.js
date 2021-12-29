// Private class, just used in ChateMensajes --> Not necessary to export it
class Mensaje {
    constructor( uid, nombre, mensaje ) {
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}

// Class to control all the messages
class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10); // Remove and return the first 10 elements
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values( this.usuarios ); // [ {}, {}, {}]
    }

    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.unshift( // Insert new element at the start of the array
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUsuario( usuario ) {
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario( id ) {
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;