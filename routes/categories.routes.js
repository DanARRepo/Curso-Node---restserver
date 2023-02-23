const { Router } = require('express');
const { check } = require('express-validator');

const { createCategorie, getCategories, getCategorie, updateCategorie, deleteCategorie } = require('../controller/categories.controller');
const { existCategorie } = require('../helpers/db-validators');
const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

// Get all categories 
router.get('/', getCategories );

// Get categories by id
router.get('/:id', [
    check('id', 'Is not a valid Mongo ID').isMongoId(),
    check('id').custom( existCategorie ),
    validateFields
], getCategorie );

// Create categorie - only users with valid token 
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
    createCategorie
]);

// Update categorie - only users with valid token 
router.put('/:id', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('id').custom( existCategorie ),
    validateFields,
], updateCategorie );

// Delete categorie - only admins 
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Is not a valid Mongo ID').isMongoId(),
    validateFields,
    check('id').custom( existCategorie )
],deleteCategorie );


module.exports = router;