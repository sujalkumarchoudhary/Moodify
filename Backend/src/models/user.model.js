const moongoose = require('mongoose');
const userSchema = new moongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user',
    },
});

const userModel = moongoose.model('user', userSchema);
module.exports = userModel;