const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

// Creamos funciones y las exportamos
const usuarioGet = async( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;

    const usuarios = await Usuario.find({ estado: true })
        .skip( Number( desde ) )
        .limit( Number(limite) );

    const total = await Usuario.countDocuments({ estado: true });

    // Desestructuración
    // const { q, nombre = 'No name', apikey } = req.query;

    // const { total, usuarios } = await Promise.all([
    //     Usuario.find({ estado: true })
    //     .skip( Number( desde ) )
    //     .limit( Number(limite) ),
    //     Usuario.countDocuments({ estado: true })
    // ]);

    res.status(200).send({
        total,
        usuarios
    })

};

const usuarioPost = async( req, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    // const { google, ... } = req.body;

    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en base de datos 

    await usuario.save();

    res.status(200).json({
        msg: 'Ya recibimos',
        usuario
    });
};

const usuarioPut = async( req, res = response ) => {
    
    // Obtener del segmento
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    // TODO: Validar contra base de datos
    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    return res.status(200).json({
        usuario 
    })

};

const usuarioDelete = async( req, res = response ) => {

    const { id } = req.params;

    const userAutenticado = req.usuario;

    // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    
    return res.json({
        usuario,
        userAutenticado
    })

}

module.exports = {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete
}