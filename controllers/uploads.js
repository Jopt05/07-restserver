const { response } = require("express");
const res = require("express/lib/response");
const { subirArchivo } = require('../helpers')
const usuario = require("../models/usuario");
const producto = require("../models/producto");
const path = require('path')
const fs = require('fs')

const cargarArchivo = async(req, res = response) => {

    try {

        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({
            msg: 'Completo',
            nombre: nombreArchivo
        })
        
    } catch (error) {

        res.status(400).json({
            msg: error
        })
        
    }
}

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;

        case 'productos':
            modelo = await producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar ésto'
            })
    }

    // Limpiar imagenes previas 
    if( modelo.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    })

}

const mostrarImagen = (req, res = response) => {

    res.status(200).json({
        msg: 'Hola mundo'
    })

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}