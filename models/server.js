const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosRoutePath = '/api/usuarios';

        this.authPath = '/api/auth';

        this.categoriasPath = '/api/categorias';

        this.productosPath = '/api/productos';

        this.buscarPath = '/api/buscar';

        this.uploadsPath = '/api/uploads';

        // Conectar a base de datos
        this.conectarDB();

        this.middlewares();

        // Rutas de la app 
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Parseo y lectura del body del post
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public') );

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        // Configurar las rutas 
        this.app.use('/api/usuarios', require('../routes/user') );

        this.app.use(this.authPath, require('../routes/auth') );

        this.app.use(this.categoriasPath, require('../routes/categorias') );

        this.app.use(this.productosPath, require('../routes/productos') );

        this.app.use(this.buscarPath, require('../routes/buscar') )

        this.app.use( this.uploadsPath, require('../routes/uploads') );

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server corriendo en:", this.port );
        });
    }

}

module.exports = Server;