const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener una categoria por id - publico
router.get('/:id',[ // Indicate path parameters with ":"
    check('id', 'No es un id de Mongo válido').isMongoId(), // Validation middlewares contained into express-validator
    check('id').custom( existeCategoriaPorId ), // Customize validation
    validarCampos, //Customize validation middleware
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT, //Customize validation middleware
    check('nombre','El nombre es obligatorio').not().isEmpty(), // Validation middlewares contained into express-validator
    validarCampos //Customize validation middleware
], crearCategoria );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[ // Indicate path parameters with ":"
    validarJWT, //Customize validation middleware
    check('nombre','El nombre es obligatorio').not().isEmpty(), // Validation middlewares contained into express-validator
    check('id').custom( existeCategoriaPorId ), //Customize validation middleware
    //check("id").custom((id) => existeCategoriaPorId(id)), //It's the same to the previous one, but indicating all in the arrow function
    validarCampos //Customize validation middleware
],actualizarCategoria );

// Borrar una categoria - Admin
router.delete('/:id',[ // Indicate path parameters with ":"
    validarJWT, //Customize validation middleware
    esAdminRole, //Customize validation middleware
    check('id', 'No es un id de Mongo válido').isMongoId(), // Validation middlewares contained into express-validator
    check('id').custom( existeCategoriaPorId ), //Customize validation middleware
    //check("id").custom((id) => existeCategoriaPorId(id)), // It's the same to the previous one, but indicating all in the arrow function
    validarCampos, //Customize validation middleware
],borrarCategoria);



module.exports = router;