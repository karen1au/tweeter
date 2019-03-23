"use strict";

// Basic express setup:

const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const cookieSession = require('cookie-session');
const app           = express();
const {MongoClient} = require("mongodb");
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";
const mongo = require("mongodb");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['malimalihome']
}));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err){
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const UserHelpers = require("./lib/util/user-helper")(db);

// Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

    //register form
  app.post("/register", async (req, res) => {
    const userExist = await doesUserExist(req.body.username);
  if (userExist){
    res.status(400);
    return;
    } else if (req.body.username && req.body.password && req.body.fullname){
      const realPw = req.body.password;
      const user = {
        name: req.body.fullname,
        handle: '@'+req.body.username,
        avatars: UserHelpers.existAvatar(req.body.username),
        password: bcrypt.hashSync(realPw, 10)
      };
        UserHelpers.saveUser(user, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send();
            // req.session.user_ID = userID;
            // res.redirect("/");
          };
        });
    // const mongoID = new mongo.ObjectId(this._id);
    // req.session.user_ID = mongoID;
  } else {
    res.status(400).send('Incomplete Information');
  }



});

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
// const DataHelpers = require("./lib/data-helpers.js")(db);

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
  async function doesUserExist(username) {
  let doesUserExist = false;
  // for (let user in UserHelpers.getAllUsers)
  const result = await db.collection("users").find({handle: '@'+username}).toArray();
  if (result.length !== 0){
    doesUserExist = true;
  }

  return doesUserExist;
}

  // function findUser(callback){
  //   db.collection("users").find().toArray((err, results) => {
  //         if (err) throw err;
  //         callback(null, results);
  //       });

  // }



app.listen(PORT, () => {
  console.log("Tweeter listening on port 🐧" + PORT);
});
})