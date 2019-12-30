var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//Búsqueda por colección
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var promesa;
    var expReg = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expReg);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, expReg);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, expReg);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda son: usuarios, médicos, hospitales',
                error: { message: 'Tipo tabla/coleccion no válido' }
            });

    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            //corchetes para hacer referencia a la variable tabla, y que como respuesta traiga la tabla dinámicamente
            [tabla]: data
        });
    })

});


//Búsqueda General, todas las colecciones
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    //sirve para que la busqueda filtre cualquier palabra y traiga todos los resultados
    var expReg = new RegExp(busqueda, 'i');
    //Para mandar un arreglo de varias promesas y retorne un arreglo con las respuestas
    Promise.all([
        buscarHospitales(busqueda, expReg),
        buscarMedicos(busqueda, expReg),
        buscarUsuarios(busqueda, expReg)
    ])
        //then retorna lo que tiene el resolve
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarHospitales(busqueda, expReg) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: expReg })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, expReg) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: expReg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, expReg) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            //or para filtrar por varias columnas
            .or([{ 'nombre': expReg }, { 'email': expReg }])
            //exec para ejecutar la query
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;