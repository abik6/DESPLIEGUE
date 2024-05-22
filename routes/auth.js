const express = require('express');
let Usuario = require('../models/usuario.js').Usuario;
let router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    try {
        const usuario = await Usuario.findOne({ login, password });

        if (usuario) {
            req.session.usuario = usuario.login;
            res.redirect('/');
        } else {
            res.render('login',
                { error: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).send("Error de servidor");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;