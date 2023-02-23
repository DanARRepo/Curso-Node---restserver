const { Router } = require('express');
const { check } = require('express-validator');

const { createProduct, 
        getProducts, 
        getProduct, 
        updateProduct, 
        deleteProduct } = require('../controller/products.controller');

const { existProduct, existCategorie } = require('../helpers/db-validators');
const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

// Get all categories 
router.get('/', getProducts );

// Get categories by id
router.get('/:id', [
    check('id', 'Is not a valid Mongo ID').isMongoId(),
    check('id').custom( existProduct ),
    validateFields
], getProduct );

// Create categorie - only users with valid token 
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('categorie', 'Is not a valid Mongo ID').isMongoId(),
    check('categorie').custom( existCategorie ),
    validateFields,
    createProduct
]);

// Update categorie - only users with valid token 
router.put('/:id', [
    validateJWT,
    // check('categorie', 'Is not a valid Mongo ID').isMongoId(),
    check('id').custom( existProduct ),
    validateFields,
], updateProduct );

// Delete categorie - only admins 
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Is not a valid Mongo ID').isMongoId(),
    check('id').custom( existProduct ),
    validateFields,
], deleteProduct );


module.exports = router;