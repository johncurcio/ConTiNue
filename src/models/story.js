var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storySchema = Schema({
    author    : { type: Schema.ObjectId, ref: 'User', required: true },
    title     : { type: String, required: true, max: 200 },
    genre     : String,
    synopsis  : String,
    createdat : { type: Date, default: Date.now },
    fragments : [{ type: Schema.ObjectId, ref: 'Fragment' }]
});

var autoPopulateAuthor = function(next) {
  this.populate('author', 'local.username');
  this.populate('fragments')
  next();
};

storySchema.
  pre('findOne', autoPopulateAuthor).
  pre('find', autoPopulateAuthor);

module.exports = mongoose.model('Story', storySchema);
