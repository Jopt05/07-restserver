const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
    files, 
    extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'],
    carpeta = ''
) => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files;
    
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];
    
        if ( !extensionesValidas.includes(extension.toLowerCase()) ) {
            return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`)
        }
    
        const nombreTemp = uuidv4() + '.' + extension;
        
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp) ;
    
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
    
            resolve( nombreTemp );
        });

    })
}

module.exports = {
    subirArchivo
}