const mongoose = require('mongoose');
const {Schema} = mongoose;
const ObjectId = Schema.ObjectId;
const AnswerSchema = new Schema({
    question : { type: ObjectId},
    text : {type: String, required: true},
    courager : {type: String, required: true}
})

module.exports = mongoose.model('Answer',AnswerSchema);