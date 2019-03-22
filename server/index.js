"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const {MongoClient} = require("mongodb");
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err){
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

    //register form
  app.post("/register", (req, res) => {
  if (doesEmailExist(req.body.email)){
    res.status(400).send('Duplicated email');
  } else if (req.body.email && req.body.password){
    const realPw = req.body.password;
    let userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: bcrypt.hashSync(realPw, 10)
    };
    req.session.user_ID = userID;
    res.redirect("/urls");
  } else {
    res.status(400).send('Incomplete Information');
  }
  });

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
function doesEmailExist(newEmail) {
  let doesEmailExist = false;
  for ( userID in users) {
    if (users[userID].email && users[userID].email == newEmail) {
     doesEmailExist = true;
     break;
    }
  }
  return doesEmailExist;
}


app.listen(PORT, () => {
  console.log("Tweeter listening on port 🐧" + PORT);
});