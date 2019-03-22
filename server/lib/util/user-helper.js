"use strict";

const Chance = require("chance");
const chance = new Chance();
const cookieSession = require('cookie-session');
let mongo = require("mongodb");
const md5 = require('md5');

module.exports = function makeUserHelpers (db) {
  return {

  saveUser: function(newUser, callback) {
    db.collection("users").insertOne(newUser);
    callback(null, true);
  },

  getAllUser: function (callback) {
    const extract = db.collection("users").find().toArray((err, results) => {
      if (err) throw err;
      callback(null, results);
    });
  },

  existAvatar: (username) => {
    const avatarUrl = `https://vanillicon.com/${md5(username)}`;
    const avatars = {
      small:   `${avatarUrl}_50.png`,
      regular: `${avatarUrl}.png`,
      large:   `${avatarUrl}_200.png`
    };
    return  avatars;
  },

  generateRandomUser: () => {
    const gender    = chance.gender();
    const firstName = chance.first({gender: gender});
    const lastName  = chance.last();
    const userName  = firstName + " " + lastName;

    let userHandle = "@";
    if (Math.random() > 0.5) {
      let prefix    = chance.prefix({gender: gender});
      prefix = prefix.replace(".", "");
      userHandle += prefix;
    }

    userHandle += lastName;

    if (Math.random() > 0.5) {
      const suffix = Math.round(Math.random() * 100);
      userHandle += suffix;
    }

    const avatarUrlPrefix = `https://vanillicon.com/${md5(userHandle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    };

    return {
      name: userName,
      handle: userHandle,
      avatars: avatars
    }


}
};
}
