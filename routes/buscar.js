const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();


router.get('/:coleccion/:termino', buscar ) // Indicate path parameters with ":"




module.exports = router;