const { response } = require("express");
const usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");


const login = async( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe 
        const user = await usuario.findOne({ correo });
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Correo'
            });
        };

        // Verificar si el usuario está activo en la DB 
        if ( !user.estado ) {
            return res.status(400).json({
                msg: 'Estado : False',
            })
        }

        // Verificar la contraseña 
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Password incorrecta',
            })
        }


        // Generar el JWT 
        const token = await generarJWT( user.id );

        return res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salió mal'
        });
    };

}

const googleSignin = async( req, res = response ) => {

    const { id_token } = req.body;

    try {

        // const googleUser = await googleVerify( id_token );

        const { correo, nombre, img } = await googleVerify( id_token );

        // Comprobamos que no exista 
        let user = await usuario.findOne({ correo });

        if ( !user ) {
            const data = { 
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            user = new usuario( data );
            await user.save();
        }
        
        // Si el usuario en DB pero estado en false
        if ( !user.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            })
        }

        // Generar el JWT 
        const token = await generarJWT( user.id );
         
        return res.status(200).json({
            user,
            token
        })
        
    } catch (error) {
     
        return res.json({
            msg: 'Token de Google no es valido'
        })

    }

}

module.exports = {
    login,
    googleSignin
}