const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const CrosswordGenerator = require("./generator.js");
const WordSelector = require("./wordSelector.js");

var docs = [];

router.get("", async (req, res, next) => {
  res.render("index");
});

router.post("/postTest", async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.category);

  res.render("index.hjs");
});

//Generate a crossword to do
router.post("/crossword", async (req, res, next) => {
  //Mongo db setup
  const uri =
    "mongodb+srv://admin:" +
    process.env.MONGO_PASS +
    "@cluster0-qjfez.mongodb.net/crosswords?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  var data = {};
  data.postData = req.body;

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const db = client.db("crosswords");
    const col = db.collection("words");

    // Make the appropriate DB calls
    //await  listDatabases(client);

    var crosswordData;

    //Find the column here, either with a category filter, or get all of them
    if (req.body.category != "All")
      crosswordData = col.find({ category: req.body.category });
    else {
      crosswordData = col.find({});
      data.postData.category = "";
    }

    docs = [];
    await crosswordData.forEach(listWords, errorFunc);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();

    data.docs = docs;
    //console.log(data.docs);
    data.attempts = 0;

    //Keep generating until a successful crossword is made
    do {
      //data.attempts++;
      //console.log("attempt " + data.attempts);
      var selector = new WordSelector(docs, req.body.wordCount);
      var generator = new CrosswordGenerator(selector.pickedWords); //This will pick the words to use and link them
      data.docs = generator.Generate(); //This will give us an actual crossword layout
      data.rowSize = generator.gridSize;
      data.layoutString = generator.layoutString;
      data.numberData = generator.numberArray;
    } while (generator.failed);

    res.render("crossword", data);
  }
});

router.post("/insert", async (req, res, next) => {
  //Mongo db setup
  const uri =
    "mongodb+srv://admin:" +
    process.env.MONGO_PASS +
    "@cluster0-qjfez.mongodb.net/crosswords?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  var data = {};

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db("crosswords");
    const col = db.collection("words");

    // Construct a document
    let newDoc = {
      word: req.body.word.toLowerCase(),
      hint: req.body.hint,
      category: req.body.category,
    };
    const count = await col.count({ word: req.body.word.toLowerCase() });
    console.log(count);
    // Insert word, but only if it exists.
    if (count == 0) {
      const p = await col.insertOne(newDoc);
      data = { submit: "Your word has been added to the generator!" };
    } else {
      data = { submit: "That word already exists!" };
    }
    // Find one document
    //const myDoc = await col.findOne();
    // Print to the console
    //console.log(myDoc);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();

    res.render("index", data);
  }
});

//Debug function that outputs database stuff
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

//Get all the word data here!
async function listWords(doc) {
  //console.log(doc);
  //var newDoc = JSON.stringify(doc, null, 4);
  //docs[(Object.keys(docs).length)] = doc;
  docs.push(doc);
  //console.log("Doc get!");
}

async function errorFunc(error) {
  if (error) console.log(error);
}

module.exports = router;
