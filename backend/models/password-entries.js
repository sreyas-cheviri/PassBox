const mongoose = require('mongoose');
const passwordSchema = new mongoose.Schema({
    PassName: {type: String , required:true},
    Password : {type: String , required: true},
    userId :{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true} // this is referring to user id in User model schema -user.js
});

module.exports =  mongoose.mondel('PasswordEntry',passwordSchema);