'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//MODELO DE UN ARTICULO, LOS DATOS QUE SE NECESITAN
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    },
    image: String,
});

//El modelo Article utilizara el JSON de arriba como base 
//articles --> guarda documentos de este tipo y con estructura dentro de la colección
module.exports = mongoose.model('Article', ArticleSchema); 