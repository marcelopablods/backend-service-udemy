var express = require('express');

var app = express();

//Rutas
app.get('/', (req, res, next) => {
    res.status(403).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

module.exports = app;