const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
    // Class to manage the express app
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app ); // Create a Node.js HTTP server
        this.io     = require('socket.io')(this.server) // Attach socket.io to a plain Node.js HTTP server

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS -- Mount the specific cors middleware function
        this.app.use( cors() );

        // Lectura y parseo del body -- Mount the specific middleware function for parsing incoming requests with json as payload
        this.app.use( express.json() );

        // Directorio Público -- Mount the specific middleware function for serving static files
        this.app.use( express.static('public') ); // Indicate the static webServer folder in which to look for the index.html

        // Fileupload - Carga de archivos -- Mount the specific middleware function for accessing to the files previously loaded
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // If you invoke .mv and there is no folder --> Create it automatically
        }));

    }

    routes() {
        // Mount the middleware function at the specified paths with a callback
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        
    }


    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) ) // Listen on a new connection is opened
        // socketController is a callback function. If you don't indicate name --> It's an anonymous function
    }

    listen() {
        this.server.listen( this.port, () => { // Our server with socket.io is the one listening, not this.app
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
