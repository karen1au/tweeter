"use strict";

let mongo = require("mongodb");
// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
        db.collection("tweets").insertOne(newTweet);
        callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(sendTweetsCallback) {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        const extract = db.collection("tweets").find().toArray((err, results) => {
          if (err) throw err;
          results.sort(sortNewestFirst);
          sendTweetsCallback(null, results);
        });
     },

     likeTweet: function(tweet_id, callback) {
      const mongoID = new mongo.ObjectId(tweet_id);
        db.collection("tweets").update(
        { _id: mongoID},
        { $inc: { like_count: 1} }
        );
     }
    };
};
