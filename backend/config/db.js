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

module.exports = db_connect;