const Usuario = require('../models/usuario').Usuario;
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/recetas');

const nuevoUsuario = new Usuario({
    login: 'pablo',
    password: '12345'
});

nuevoUsuario.save().catch(error => {
    console.log('Error al guardar el usuario:', error);
});
