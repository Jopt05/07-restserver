const { response, request } = require("express");
const categoria = require("../models/categoria");
const usuario = require("../models/usuario");

// Obtener categorias: Paginado - Total - Populate 
const obtenerCategorias = async( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;

    const categorias = await categoria.find({ estado: true })
        .skip( Number( desde ) )
        .limit( Number(limite) )
        .populate('usuario');

    const total = await categoria.countDocuments({ estado: true });

    return res.status(200).send({
        total,
        categorias
    });

};

// Obtener categoria: Populate - Un solo objeto
const obtenerCategoria = async( req, res = response ) => {

    const { id } = req.params;

    const Categoria = await categoria.findById( id ).populate('usuario');

    if ( !Categoria.estado ) {
        return res.status(401).json({
            msg: 'La categoría está bloqueada',
        });
    };

    // if ( !Categoria ) {
    //     return res.status(401).json({
    //         msg: 'La categoría con esa ID no existe',
    //     });
    // };

    return res.json(Categoria);

}

const crearCategoria = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    // const categoriaDB = await categoria.findOne({ nombre });

    // if ( categoriaDB ) {
    //     return res.status(400).json({
    //         msg: `La categoría ${ categoriaDB.nobre } ya existe`,
    //     });
    // };

    // Generar la data a guardar, queremos evitar recibir el estado
    const data = {
        nombre,
        // Obteniendo el usuario del JWT 
        usuario: req.usuario._id,
    };

    const categoria1 = new categoria( data );

    await categoria1.save();

    return res.status(201).json(categoria1);

}

// Recibimos nombre a actualizar, la ruta es /:id 
const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params;

    const nombre = req.body.nombre.toUpperCase();

    // let Categoria = await categoria.findById( id );

    // if ( !Categoria ) {
    //     return res.status(400).json({
    //         msg: 'La categoría con ese ID no existe',
    //     });
    // };

    const data = {
        nombre,
        usuario: req.usuario._id,
    };

    const Categoria = await categoria.findByIdAndUpdate( id, data );

    return res.status(200).json(Categoria)

}

// Borrar categoria, cambiamos el estado y obtenemos el id 
const borrarCategoria = async( req, res = response ) => {

    const { id } = req.params;

    // let Categoria = await categoria.findById( id );

    // if ( !Categoria ) {
    //     return res.status(400).json({
    //         msg: 'La categoría con ese ID no existe',
    //     });
    // };

    const Categoria = await categoria.findByIdAndUpdate( id, { estado: false } );

    return res.status(200).json(Categoria);

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}