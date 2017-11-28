var mongoose = require('mongoose');
var Vote    = require('../models/vote')

exports.upvote = function(req, res){
    var fragmentid = req.body.fragment,
    userid = req.body.user,
    vote = req.body.vote

    var query = {'fragment': fragmentid, 'user': userid};
    var update = {$set:{fragment: fragmentid, user: userid, vote: vote}};
    var options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };

    Vote.findOneAndUpdate(query, update, options, function (error, doc) {
        if(error){
            console.log("Something wrong when updating data!");
        }
    });
};

exports.votes = function(req, res, next){
    Vote.find().exec(function(err, list_votes){
        if (err) { return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ votes: list_votes }));
    });
};