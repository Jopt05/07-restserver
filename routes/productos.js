const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId, esRoleValido } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

// Crear producto 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'La categoría no tiene ID valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
],
crearProducto)

// Obtener productos 
router.get('/', obtenerProductos);

// Obtener producto por ID 
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],
obtenerProducto )

// Actualizar producto - Privado
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'El nombre es obligatorio').not().isEmpty(),
    check('disponible', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],
actualizarProducto )

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],
borrarProducto )

module.exports = router;