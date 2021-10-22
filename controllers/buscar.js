const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles',
];

// Permite buscar por ID o nombre 
const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.status(200).json({
            results: ( usuario ) ? [ usuario ] : []
        })
    };

    // Realizar busquedas insensitivas 
    const regex = new RegExp( termino, 'i' );

    // En el find tenemos and, or y demás 
    const usuarios = await Usuario.find({
        $or: [{  nombre: regex  }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.status(200).json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );
        return res.status(200).json({
            results: ( categoria ) ? [ categoria ] : []
        })
    };

    // Realizar busquedas insensitivas 
    const regex = new RegExp( termino, 'i' );

    // En el find tenemos and, or y demás 
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    return res.status(200).json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const producto = await Producto.findById( termino ).populate('categoria','usuario');
        return res.status(200).json({
            results: ( producto ) ? [ producto ] : []
        })
    };

    // Realizar busquedas insensitivas 
    const regex = new RegExp( termino, 'i' );

    // En el find tenemos and, or y demás 
    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria','usuario');

    return res.status(200).json({
        results: productos
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: ` Las colecciones permitidas son: ${ coleccionesPermitidas } `,
        });
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;

        case 'categoria':
            buscarCategorias( termino, res )
            break;

        case 'productos':
            buscarProductos( termino, res )
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta busqueda'
            })
            break;
    }

}

module.exports = {
    buscar
}