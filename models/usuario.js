const mongoose = require("mongoose");

let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'El usuario es obligatorio'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = {
    Usuario: Usuario
};