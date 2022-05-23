const dbValidators = require('./db-validators')
const generarJWT = require('./generarJWT')
const googleVerify = require('./google-verify')
const subirArchivo = require('./subir-archivo')
const validarArchivoSubir = require('./validar-archivo')

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...validarArchivoSubir
}