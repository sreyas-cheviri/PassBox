const mongoose  = require('mongoose')
require('dotenv').config();

const db_connect =  async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true, //MongoDB has updated its connection string format, and this setting helps Mongoose use the latest parser to handle any new format.
            useUnifiedTopology: true //This enables the new unified topology engine in MongoDB’s driver
        });
        console.log('db connected');
        
    }catch(e){
        console.error(e.message);
        process.exit(1);
    }
}



// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("Connected to MongoDB");
// }).catch(err => console.error("Could not connect to MongoDB", err));




module.exports = db_connect;