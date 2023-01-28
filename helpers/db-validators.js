const Role = require('../models/role');
const User = require('../models/user');

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

module.exports = {
    isValidRole,
    isValidEmail,
    existUserById
}