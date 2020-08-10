'use strict';

var express = require('express');
//Cargamos el controllador
var ArticleController = require('../controllers/article');

var router = express.Router();

//Cargamos el multiparty para la munipulación de subida de archivos
var multipart = require('connect-multiparty');
//Middleware de multiparty que enseña en donde va grabar los archivos del upload
var md_upload = multipart({uploadDir: './upload/articles'});

//Rutas de prueba
router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);

//Rutas utiles
//post envio de datos como nuevos
//put actualizar datos
//get solicitar datos
//delete eliminar datos
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.updateArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;