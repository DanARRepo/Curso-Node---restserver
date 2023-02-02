const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
    if ( !req.user ) {
        return res.status(500).json({
            msg: 'You want to verify the role without validating the token first'
        })
    }

    const { role, name } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } is not admin - you cant do this action`
        });
    }

    next();
}

const hasRole = ( ...roles ) => {
    return (req, res = response, next) =>{

        if ( !req.user ) {
            return res.status(500).json({
                msg: 'You want to verify the role without validating the token first'
            });
        }

        if ( !roles.includes(req.user.role) ) {
            return res.status(401).json({
                msg: `Service require one of this roles ${roles}`
            });
        }

        next();
        
    }
}

module.exports = {
    isAdminRole,
    hasRole
}
