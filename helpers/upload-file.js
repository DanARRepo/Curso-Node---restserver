const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFl = ( files, extensionsAllowed = ['png','jpg','jpeg','gif','pdf'], folder = '' ) => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const shortName = file.name.split('.');
        const extension = shortName[ shortName.length -1];
    
        if ( !extensionsAllowed.includes(extension) ) {
            return reject(`Extension ${extension} is not allowed - ${extensionsAllowed}`);
        }
    
        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );
    
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
    
            resolve(tempName);
        }); 
    });
}

module.exports = {
    uploadFl
}