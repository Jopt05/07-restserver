const { response, request } = require("express")

const esAdminRole = ( req = request, res = response, next  ) => {

    // Comprobamos que si venga el usuario 
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero',
        });
    };

    // Si viene desestructuramos lo que nos importa y el nombre para mostrar el
    // mensaje 
    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador`,
        })
    }

    next();

}

module.exports = {
    esAdminRole
}