var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//Verificar Token(middleware)
exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token inválido',
                errors: err
            });
        }
        //función para que continúe ejecutando los demás métodos en caso de no entrar al error
        //next();
        req.usuario = decoded.usuario;
        next();
    });
}