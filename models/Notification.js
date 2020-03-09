const mongoose = require('mongoose');
const {Schema} = mongoose;
const ObjectId = Schema.ObjectId;
const NotifificationSchema = new Schema({
    destination :  ObjectId,
    read : {type: Boolean, default: false}
})

module.exports = mongoose.model('Notification',NotifificationSchema);