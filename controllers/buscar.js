const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino); // Existing default method in all models
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // 'i' flag in the pattern, to make a case-insensitive search === No case sensitive
    const usuarios = await Usuario.find({ // Existing default method in all models
        $or: [{ nombre: regex }, { correo: regex }], // Separated by ',' the or queries
        $and: [{ estado: true }] // Separated by  ',' the and queries
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino); // Existing default method in all models
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // 'i' flag in the pattern, to make a case-insensitive search === No case sensitive
    const categorias = await Categoria.find({ nombre: regex, estado: true }); // Existing default method in all models

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino) // Existing default method in all models
                            .populate('categoria','nombre'); // Adding fields to return for linked documents
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // 'i' flag in the pattern, to make a case-insensitive search === No case sensitive
    const productos = await Producto.find({ nombre: regex, estado: true }) // Existing default method in all models
                            .populate('categoria','nombre') // Adding fields to return for linked documents

    res.json({
        results: productos
    });

}


const buscar = ( req, res = response ) => {
    
    const { coleccion, termino  } = req.params; // Get the path params indicated in the request with ":"

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}



module.exports = {
    buscar
}