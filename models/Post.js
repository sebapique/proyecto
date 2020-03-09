const mongoose = require('mongoose');
const {Schema} = mongoose;
const PostSchema = new Schema({
    user : {type: String, required: true},
    gender : {type: String, required: true},
    text : {type: String, required: true},
    answered: {type: Boolean, default: false},
    cost : {type: Number, required: true},
    number: {type: Number, default: 0}
})

module.exports = mongoose.model('Post',PostSchema);