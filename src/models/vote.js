var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var votesSchema = Schema({
    user         : { type: Schema.ObjectId, ref: 'User', required: true },
    fragment     : { type: Schema.ObjectId, ref: 'Fragment', required: true },
    vote         : { type: Number, default: 0 }
});

module.exports = mongoose.model('Vote', votesSchema);