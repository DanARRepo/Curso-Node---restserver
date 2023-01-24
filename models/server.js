const express = require('express')
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usersPath = '/api/users'

        // Middleares 
        this.middlewares();

        // Rutas app 
        this.routes();
    }

    middlewares() {
        // CORS 
        this.app.use( cors() );

        // Read & parse body 
        this.app.use( express.json() );

        // Directorio publico 
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use( this.usersPath, require('../routes/user.routes') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
    }
}

module.exports = Server;