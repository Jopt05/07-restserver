
const { Router } = require('express');
const { check } = require('express-validator');
const { usuarioGet, usuarioPost, usuarioPut, usuarioDelete } = require('../controllers/user');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const Role = require('../models/role');

// Aqui configuramos las rutas
const router = Router();

router.get('/', usuarioGet);
  
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usuarioPut);
  
router.post('/', 
  [
    check('nombre', 'El nombre no es obligatorio').not().isEmpty(),
    check('password', 'El password no es obligatorio y más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    check('correo').custom( emailExiste ),
    validarCampos
  ]
,usuarioPost);
  
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usuarioDelete);

module.exports = router;