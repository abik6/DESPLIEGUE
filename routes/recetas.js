const express = require('express');
const receta = require('../models/receta.js');
const upload = require(__dirname + '/../utils/uploads.js');

let Receta = require('../models/receta.js').Receta;
let Ingrediente = require('../models/receta.js').Ingrediente;
let router = express.Router();
const { autenticacion } = require('../auth/auth');

// Listado de recetas
router.get('/', (req, res) => {
    Receta.find().then(resultado => {
        res.render('recetas_listado', { recetas: resultado });
    }).catch(error => {
    });
});

// Formulario nueva receta
router.get('/nueva', (req, res) => {
    res.render('recetas_nueva');
});


// Ficha receta
router.get('/:id', (req, res) => {
    Receta.findById(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.render('recetas_ficha', { receta: resultado });
            } else {
                res.render('error', { mensaje: "No existe esa receta actualmente" });
            }
        })
        .catch(error => {
            res.render('error', { mensaje: "Error buscando la receta indicada" });
        });
});

// Formulario editar receta
router.get('/editar/:id', autenticacion, (req, res) => {
    Receta.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('recetas_editar', { receta: resultado });
        } else {
            res.render('error', { error: "Receta no encontrada" });
        }
    }).catch(error => {
        res.render('error', { error: "Receta no encontrada" });
    });
});

// Insertar recetas
router.post('/', autenticacion, upload.upload.single('imagen'), (req, res) => {
    let nuevaReceta = new Receta({
        titulo: req.body.titulo,
        comensales: req.body.comensales,
        preparacion: req.body.preparacion,
        coccion: req.body.coccion,
        descripcion: req.body.descripcion
    });
    if (req.file)
        nuevaReceta.imagen = req.file.filename;

    nuevaReceta.save()
        .then(resultado => {
            res.redirect('/recetas');
        })
        .catch(error => {
            let errores = Object.keys(error.errors);
            let mensaje = "";
            if (errores.length > 0) {
                errores.forEach(clave => {
                    mensaje += '<p>' + error.errors[clave].message + '</p>';
                });
            }
            else {
                mensaje = 'Error añadiendo receta';
            }
            res.render('error', { error: mensaje });
        });
});

// Modificar recetas
router.post('/:id/editar', autenticacion, upload.upload.single('imagen'), (req, res) => {
    Receta.findById(req.params.id)
        .then(resultado => {
            if (!resultado) {
                throw new Error('Receta no encontrada');
            }

            resultado.titulo = req.body.titulo;
            resultado.comensales = req.body.comensales;
            resultado.coccion = req.body.coccion;
            resultado.preparacion = req.body.preparacion;
            resultado.descripcion = req.body.descripcion;

            if (req.file) {
                resultado.imagen = req.file.filename;
            }

            return resultado.save();
        })
        .then(resultado2 => {
            res.redirect('/recetas');
        })
        .catch(error => {
            console.log(error);
            res.render('error', { error: "Error editando receta" });
        });
});


// Formulario insertar ingrediente
router.get('/:id/ingredientes/nuevo', autenticacion, (req, res) => {
    Receta.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('ingredientes_nuevo', { receta: resultado });
        } else {
            res.render('error', { error: "Receta no encontrada" });
        }
    }).catch(error => {
        res.render('error', { error: "Receta no encontrada" });
    });
});

// Insertar ingredientes
router.post('/:id/ingredientes', autenticacion, (req, res) => {
    const nuevoIngrediente = new Ingrediente({
        nombre: req.body.nombre,
        cantidad: req.body.cantidad,
        unidad: req.body.unidad
    });
    Receta.findById(req.params['id']).then(receta => {
        if (!receta) {
            throw new Error('Receta no encontrada');
        }

        receta.ingredientes.push(nuevoIngrediente);

        return receta.save();
    })
        .then(resultado => {
            nuevoIngrediente.save();
            res.redirect(`/recetas/${resultado.id}`);
        })
        .catch(error => {
            res.render('ingredientes_nuevo', { error: error.message, recetaId: req.params['id'] });
        });
});



// Borrar recetas 
router.delete('/:id', autenticacion, (req, res) => {
    Receta.findByIdAndDelete(req.params.id).then(resultado => {
        res.redirect('/recetas');
    }).catch(error => {
        res.render('error', { error: "Error borrando receta" });
    });
});

// Borrar ingredientes
router.delete('/:id/ingredientes/:ingredienteId', autenticacion, (req, res) => {
    Receta.findById(req.params.id)
        .then(receta => {
            if (!receta) {
                throw new Error('Receta no encontrada');
            }
            const index = receta.ingredientes.findIndex(ingrediente => ingrediente._id.toString() === req.params.ingredienteId);
            if (index === -1) {
                throw new Error('Ingrediente no encontrado en la receta');
            }
            const ingredienteId = receta.ingredientes[index]._id;
            receta.ingredientes.splice(index, 1);
            return receta.save().then(() => {
                return Ingrediente.findByIdAndDelete(ingredienteId);
            });
        })
        .then(resultado => {
            res.redirect(`/recetas/${req.params.id}`);
        })
        .catch(error => {
            res.render('error', { error: error.message });
        });
});


module.exports = router;

