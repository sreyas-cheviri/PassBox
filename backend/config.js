require('dotenv').config();
const mongoose = require('mongoose');
// console.log(process.env);  

// console.log('Mongo URI:', process.env.MONGO_URI); 

const db_connect = async () => {
    try {
        console.log('DB try'); 
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected');
    } catch (e) {
        console.error('Error connecting to the database:', e.message);
        process.exit(1);
    }
};
// console.log('DB ');
db_connect();


// mongoose.connect(process.env.MONGODB_URI).then(() => {
//     console.log("Connected to MongoDB");
// }).catch(err => console.error("Could not connect to MongoDB", err));




module.exports = db_connect;