const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            search: '/api/search',
            products: '/api/products',
            users: '/api/users',
        };

        // Conectar a base de datos
        this.conectarDB();

        // Middleares 
        this.middlewares();

        // Rutas app 
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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
        this.app.use( this.paths.auth, require('../routes/auth.routes') );
        this.app.use( this.paths.categories, require('../routes/categories.routes') );
        this.app.use( this.paths.search, require('../routes/search.routes') );
        this.app.use( this.paths.products, require('../routes/products.routes') );
        this.app.use( this.paths.users, require('../routes/user.routes') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
    }
}

module.exports = Server;