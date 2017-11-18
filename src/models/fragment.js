var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fragmentSchema = Schema({
    author      : { type: Schema.ObjectId, ref: 'User', required: true },
    data        : String,
    createdat   : { type: Date, default: Date.now },
    modifieddat : { type: Date, default: Date.now }
});

var autoPopulateAuthor = function(next) {
  this.populate('author', 'local.username');
  next();
};

fragmentSchema.
  pre('findOne', autoPopulateAuthor).
  pre('find', autoPopulateAuthor);

module.exports = mongoose.model('Fragment', fragmentSchema);
