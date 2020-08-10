'use strict';

//Para poder validar los datos
var validator = require('validator');

//Libreria para eliminar archivos
var fs = require('fs');
var path = require('path');

//Modelo del artículo
var Article = require('../models/article');
const article = require('../models/article');

var controller = {

    //METODOS
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: "Master en Frameworks de JS",
            autor: "Andres Ramirez",
            url: "andresramirez.com",
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: "Soy la acción test de mi controlador de articulos",
        });
    },

    //Metodo para grabar o crear un articulo como tal
    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_title && validate_content){
            
            //Crear el objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;

            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }
           
            // Guardar el articulo
            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }
       
    },

    //Metodo que devuelve todos los artículos
    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if(last || last!=undefined){
            //Limite a la query
            query.limit(4); 
        }

        //find de todo de la BD
        //Article.find({}).sort('-_id') sacar todos los articulos ordenados desc por id
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "La consulta de articulos dio error",
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: "No existen artículos",
                });
            }

            return res.status(200).send({
                status: 'success',
                articles,
            });
        });
    },

    //Metodo que devuelve un solo articulo
    getArticle: (req, res) => {

        //recoger id de la URL
        var articleId = req.params.id;

        //comprobar que existe
        if(!articleId || articleId==null){
            return res.status(404).send({
                status: 'error',
                message: "No llego ID",
            });
        }
        
        //buscar el artículo
        Article.findById(articleId, (err, article) => {
            if(err || !article){
                return res.status(200).send({
                    status: 'error',
                    message: "No existe el artículo",
                });
            }

            return res.status(200).send({
                status: 'success',
                article,
            });
        });
    },

    //Método para actualizar un articulo
    updateArticle: (req, res) => {

        //recoger id de la URL (artículo que vamos a modificar)
        var articleId = req.params.id;

        //recoger los datos que se enviaron a modificar
        var params = req.body;

        //validar los datos
        try{
            //true si no esta vacio params.dato
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: "Faltan datos por enviar",
            });
        }

        if(validate_content && validate_title){
            
            //comprobar que existe el id
            if(!articleId || articleId==null){
                return res.status(404).send({
                    status: 'error',
                    message: "No llego ID",
                });
            }

            //buscar el artículo (find) y modificarlo (update)
            //el new:true devuelve el objeto que se esta pasando actualizado
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {

                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: "Error en el servidor al actualizar artículo",
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: "No existe el artículo para ser actualizado",
                    });
                }
    
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated,
                });

            });
        }
        else{
            return res.status(200).send({
                status: 'error',
                message: "Los datos no son validos",
            });
        }
        
    },

    //Método para eliminar un articulo
    deleteArticle: (req, res) => {

        //recoger id de la URL (artículo que vamos a eliminar)
        var articleId = req.params.id;

        //comprobar que existe el id
        if(!articleId || articleId==null){
            return res.status(404).send({
                status: 'error',
                message: "No llego ID",
            });
        }

        //find and delete
        //el new:true devuelve el objeto que se esta pasando actualizado
        Article.findOneAndDelete({_id: articleId}, (err, articleDeleted) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "Error en el servidor al eliminar artículo",
                });
            }

            if(!articleDeleted){
                return res.status(200).send({
                    status: 'error',
                    message: "No existe el artículo para ser eliminado",
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleDeleted,
            });

        });
    },

    //Método para la carga de archivos
    upload: (req, res) => {
        //Configurar el modulo connect multiparty router/article.js (backend > routes > article.js)

        //Recoger el fichero de la petición
            var file_name = 'Imagen no subida...';

            if(!req.files){
                return res.status(404).send({
                    status: 'error',
                    message: file_name,
                });
            }

        //Conseguir el nombre y la extensión del archivo
            var file_path = req.files.file0.path;
            //la ruta o path se ve así upload\\articles\\nombrearchivo.extension
            //el file_split generara según el caso de arriba 3 partes distintas generando una matriz
            //y el nombre que nos importa estaria en el espacio [2] del array
            //SI ES LINUX O MAC -la diferencia seria que n vez de '\\' seria '/' y ya
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var extension_split = file_name.split('\.');
            var file_extension = extension_split[1];

        //Comprobar la extensión (tipo de archivo)
            if(file_extension != 'png' && file_extension != 'jpg' && file_extension != 'jpeg' && file_extension != 'gif'){
                //Borrar el archivo de la carpeta upload/articles
                fs.unlink(file_path, (err) => {
                    return res.status(200).send({
                        status: 'error',
                        message: "La extensión o tipo de archivo no es valido",
                    });
                });
            }
            else{
                //Si todo es valido - Buscamos el artículo y le actualizamos el path de la imagen
                var articleId = req.params.id;

                if(articleId){
                    //parametros: id de articulo / objeto o datos a modificar / new=true que retone objeto modificado
                    Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                        if(err){
                            return res.status(500).send({
                                status: 'error',
                                message: "Error en el servidor al actualizar imagen del artículo",
                            });
                        }
        
                        if(!articleUpdated){
                            return res.status(404).send({
                                status: 'error',
                                message: "No existe el artículo para ser actualizado",
                            });
                        }
            
                        return res.status(200).send({
                            status: 'success',
                            fichero: req.files,
                            split: file_split,
                            file_extension,
                            article: articleUpdated,
                        });
                    });
                }
                else{
                    return res.status(200).send({
                        status: 'success',
                        image: file_name
                    });
                }
                
            }
    },

    //Método para sacar la imagen de la API
    getImage: (req, res) => {
        //Sacar el nombre del fichero que recibimos como parametro
            var file = req.params.image;
            var path_file = './upload/articles/'+file;

        //Comprobamos si el fichero dado existe
            fs.exists(path_file, (exists) => {
                if(exists){
                    //.sendFile viene de express y sirve para enviar la image
                    //path que traemos de la libreria importa tiene el resolve que acomoda la imagen
                    return res.sendFile(path.resolve(path_file));
                }
                else{
                    return res.status(404).send({
                        status: 'error',
                        message: 'El fichero no existe!!!',
                    });
                }
            });
    },

    //Método para buscar artículos en la API rest
    search: (req, res) => {
        //Sacar el string de la busqueda
        var searchString = req.params.search;

        //Find or con la porción del string que estemos buscando
        //la primera quiere decir que cuando el title contenga el searchString (incluido) sacara el dato
        //la segunda seria exactamente la misma situación pero ahora con el content
        Article.find({ "$or":[
            { "title": {"$regex": searchString, "$options": "i"} },
            { "content": {"$regex": searchString, "$options": "i"} },
        ]})
        .sort([['date', 'descending']])   //sort ordenamiento
        .exec((err, articles) => {        //exec manda a ejecutar la consulta

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "La consulta de articulos dio error",
                });
            }

            if(!articles || articles.length<=0){
                return res.status(404).send({
                    status: 'error',
                    message: "No existen artículos coincidentes",
                });
            }

            return res.status(200).send({
                status: 'success',
                articles,
            });
        });
    },

}; //end of controller

module.exports = controller;