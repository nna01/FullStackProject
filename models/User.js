const mongoose = require('mongoose');
const {Schema} = mongoose; //Destructuring

const userSchema = new Schema({

    googleId: String
});

mongoose.model('users', userSchema);
