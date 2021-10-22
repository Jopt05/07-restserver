const mongoose = require('mongoose');

const dbConnection = async() => {
    
    // Siempre es bueno usar trycatch
    try {

        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('Base de datos online');

    } catch (error) {
        throw new Error('Error en la base de datos');
    }

}

module.exports = {
    dbConnection,
}