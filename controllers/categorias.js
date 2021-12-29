const { response } = require('express');
const { Categoria } = require('../models');


const obtenerCategorias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query; // For getting query params. Nothing has to be added in the route class
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([ // Promise.all launch several await requests in parallel
        Categoria.countDocuments(query), // Existing default method in all models
        Categoria.find(query) // Existing default method in all models
            .populate('usuario', 'nombre')
            .skip( Number( desde ) ) // Since req.query params are string, and we need numbers --> We need to cast them
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;  // Get the path params indicated in the request with ":"
    const categoria = await Categoria.findById( id ) // Existing default method in all models
                            .populate('usuario', 'nombre');

    res.json( categoria );

}

const crearCategoria = async(req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre }); // Existing default method in all models

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id // In the middleware function validarJWT, we add usuario object retrieved from database to request object
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save(); // Existing default method in all models

    res.status(201).json(categoria);

}

const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id; // In the middleware function validarJWT, we add usuario object retrieved from database to request object

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });  // Existing default method in all models

    res.json( categoria );

}

const borrarCategoria = async(req, res =response ) => {

    const { id } = req.params; // Get the path params indicated in the request with ":"
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true }); // Existing default method in all models
    // Don't delete the register in the database, just disable it

    res.json( categoriaBorrada );
}




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}