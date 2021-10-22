const { response, request } = require("express");
const categoria = require("../models/categoria");
const producto = require("../models/producto");
const usuario = require("../models/usuario");

const crearProducto = async( req = request, res = response ) => {

    const { nombre, precio, descripcion, categoria } = req.body;

    const data = {
        nombre,
        precio: Number( precio ),
        descripcion,
        categoria,
        usuario: req.usuario._id,
    }

    const Producto = new producto( data );

    await Producto.save();

    return res.status(201).json(Producto);

}

const obtenerProductos = async( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;

    const productos = await producto.find({ estado: true })
        .skip( Number( desde ) )
        .limit( Number(limite) )
        .populate('usuario')
        .populate('categoria');

    const total = await producto.countDocuments({ estado: true });

    return res.status(200).json({
        total,
        productos
    });

}

const obtenerProducto = async( req, res = response ) => {

    const { id } = req.params;

    const Producto = await producto.findById( id ).populate('usuario').populate('categoria');

    if( !Producto.estado ) {
        return res.status(401).json({
            msg: 'El producto está bloqueado',
        });
    }

    return res.json(Producto)

}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;

    const nombre = req.body.nombre.toUpperCase();

    const { descripcion, precio, disponible } = req.body;

    const data = {
        nombre,
        descripcion,
        precio,
        usuario: req.usuario._id,
        disponible
    }

    const Producto = await producto.findByIdAndUpdate( id, data );

    return res.status(200).json(Producto);

}

const borrarProducto = async( req, res = response ) => {

    const { id } = req.params;

    const Producto = await producto.findByIdAndUpdate( id, { estado: false } );

    return res.status(200).json(Producto);

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}