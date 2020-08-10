'use strict'

//mongoose recuerda hace de ORM
var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

//useNewUrlParser: true permite usar todo lo nuevo de mongo
//mongoose.Promise = global.Promise; 
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Conexión a la base de datos correcta !!!');

            // Crear servidor y ponerme a escuchar peticiones HTTP
            app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port);
            });

        });