const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({   //schema 
    username: { type: String, required: true, unique: true }, //mandatorry field
    password: { type: String, required: true },
    createdAt:{ type:Date ,default: Date.now()}
})


// it is ideal to write this logiv here thhan at routes - better to handle password hashing in the schema model
userSchema.pre('save', async function (next) {  // this is a middle ware by mongoose achema , its is executed before save in DB or chnage s mafde to password (not here)// i ma not  hashing in route like in class 
    
    if(!this.createdAt){
        this.createdAt = Date.now();
    }
    
    if (!this.isModified('password')) return next(); // when created frist time - the password is considerd as modified - so it is hashed 
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

module.exports = mongoose.model('User', userSchema);

