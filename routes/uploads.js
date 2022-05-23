const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas, validarArchivoSubir } = require('../helpers');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', [
    validarArchivoSubir,
]
, cargarArchivo);

router.put('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarArchivoSubir,
    validarCampos
]
, actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
]
, mostrarImagen)

module.exports = router;