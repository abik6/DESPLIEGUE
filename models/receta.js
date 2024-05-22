const mongoose = require("mongoose");

let ingredienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del ingrediente es obligatorio'],
        minlength: [2, 'El nombre del ingrediente debe tener al menos 2 caracteres']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad del ingrediente es obligatoria'],
        min: [1, 'La cantidad del ingrediente debe ser mayor que 0']
    },
    unidad: {
        type: String,
        enum: {
            values: ['gr', 'cucharadas', 'unidades'],
            message: 'La unidad del ingrediente debe ser "gr", "cucharadas" o "unidades"'
        },
        required: [true, 'La unidad del ingrediente es obligatoria']
    }
});

let recetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título de la receta es obligatorio'],
        minlength: [5, 'El título de la receta debe tener al menos 5 caracteres']
    },
    imagen: String,
    comensales: {
        type: Number,
        required: [true, 'El número de comensales es obligatorio'],
        min: [1, 'El número de comensales debe ser mayor que 0']
    },
    preparacion: {
        type: Number,
        min: [1, 'El tiempo de preparación debe ser mayor que 0']
    },
    coccion: {
        type: Number,
        required: [true, 'El tiempo de cocción es obligatorio'],
        min: [0, 'El tiempo de cocción debe ser mayor o igual que 0']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción de la receta es obligatoria']
    },
    ingredientes: [ingredienteSchema]
});

const Receta = mongoose.model('Receta', recetaSchema);
const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);

module.exports = {
    Receta: Receta,
    Ingrediente: Ingrediente
};
