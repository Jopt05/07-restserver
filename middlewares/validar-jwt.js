const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    
    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion',
        })
    }

    // Es algo engañoso así que usamos trycatch 
    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const user = await usuario.findById( uid );

        if( !user ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            })
        }

        // Verificar si el uid tiene estado en true 
        if ( !user.estado )  {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado false '
            })
        }

        req.usuario = user;
        
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT,
}