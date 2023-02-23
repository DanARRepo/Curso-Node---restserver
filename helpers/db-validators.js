const { Categorie, User, Role, Product } = require('../models');

const isValidRole = async(role = '') =>{
    const existRole = await Role.findOne({ role });
    if ( !existRole ) {
        throw new Error(`Role ${role} is not defined in BD`);
    }
};

const isValidEmail = async( email = '' ) => {
    const emailExist = await User.findOne({ email });
    if ( emailExist ) {
        throw new Error(`Email ${email} is already registered`);
    }
};

const existUserById = async( id ) => {
    const userExist = await User.findById(id);
    if ( !userExist ) {
        throw new Error(`Id: ${id}, does not exist`);
    }
};

// Categories 
const existCategorie = async( id ) => {
    const categorieExist = await Categorie.findById(id);
    if ( !categorieExist ) {
        throw new Error(`Categorie with id: ${id}, does not exist`);
    }
};

// Products 
const existProduct = async( id ) => {
    const productExist = await Product.findById(id);
    if ( !productExist ) {
        throw new Error(`Product with id: ${id}, does not exist`);
    }
};

module.exports = {
    isValidRole,
    isValidEmail,
    existUserById,
    existCategorie,
    existProduct
}