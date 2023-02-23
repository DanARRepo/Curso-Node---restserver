const { response } = require("express");
const { Categorie } = require("../models");

// getCategories - page - total - populate 
const getCategories = async( req, res = response ) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [ total, categories ] = await Promise.all([
        Categorie.countDocuments(query),
        Categorie.find(query)
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]).catch( (err) => {
        console.error(err);
    });

    res.status(200).json({
        total,
        categories
    })
}

// getCategorie - populate {}
const getCategorie = async( req, res = response ) => {
    const { id } = req.params;
    const categorie = await Categorie.findById(id).populate('user', 'name');

    res.json( categorie );
}

const createCategorie = async( req, res = response ) => {
    
    const name = req.body.name.toUpperCase();
    const categorieDB = await Categorie.findOne({ name });

    if ( categorieDB ) {
        return res.status(400).json({
            msg: `Categorie ${ categorieDB.name }, already exist`
        });
    }

    // Generate data 
    const data = {
        name,
        user: req.user._id
    }

    const categorie = new Categorie(data);

    await categorie.save();

    res.status(201).json(categorie);
}

// updateCategorie
const updateCategorie = async( req, res = response ) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const categorie = await Categorie.findByIdAndUpdate(id, data, { new: true });

    res.json( categorie );
}

// deleteCategorie - state:false 
const deleteCategorie = async( req, res = response ) => {
    try {
        const { id } = req.params;
    
        const categorie = await Categorie.findByIdAndUpdate(id, { state: false });
    
        res.status(202).json(categorie)
    } catch (error) {
        res.status(400).json({
            msg: 'Something went wrong',
            error
        });
    }
}

module.exports = {
    getCategories,
    getCategorie,
    createCategorie,
    updateCategorie,
    deleteCategorie
}