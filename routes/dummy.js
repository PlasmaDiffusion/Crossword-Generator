
const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');


var docs = {};

//Hello world
router.get('/', async(req, res, next) => {

    //Mongo db setup
    const uri = "mongodb+srv://admin:OyDiI2qNWvvVGreF@cluster0-qjfez.mongodb.net/crosswords?retryWrites=true&w=majority";

    //const uri = "mongodb+srv://admin:OyDiI2qNWvvVGreF@cluster0-qjfez.mongodb.net/crosswords?retryWrites=true&w=majority";
    const client = new MongoClient(uri);


    var crosswordData;
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        
        const db = client.db("crosswords");
        const col = db.collection("words");
 
        // Make the appropriate DB calls
        await  listDatabases(client);

        crosswordData = col.find({category:"all"});
        crosswordData.forEach(listWords,errorFunc);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();


        res.render('index', crosswordData);
    }



})

router.get('/insert', async(req, res, next) => {

    const url = "mongodb+srv://admin:OyDiI2qNWvvVGreF@cluster0-qjfez.mongodb.net/dbname?retryWrites=true&w=majority";
    const client = new MongoClient(url);
 
    // The database to use
    const dbName = "test";
   

    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "people"
        const col = db.collection("people");

        // Construct a document                                                                                                                                                              
        let personDocument = {
            "name": { "first": "Alan", "last": "Turing" },
            "birth": new Date(1912, 5, 23), // June 23, 1912                                                                                                                                 
            "death": new Date(1954, 5, 7),  // June 7, 1954                                                                                                                                  
            "contribs": [ "Turing machine", "Turing test", "Turingery" ],
            "views": 1250000
        }
        const count = await col.count({"name.first":"Alan"});
        console.log(count);
        // Insert a single document, wait for promise so we can read it back
        if (count == 0)
        {
        const p = await col.insertOne(personDocument);
        }
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        //console.log(myDoc);

       } catch (err) {
        console.log(err.stack);
    }

    finally {
       await client.close();

   }
})

router.get('/update', async(req, res, next) => {

    const url = "mongodb+srv://admin:OyDiI2qNWvvVGreF@cluster0-qjfez.mongodb.net/dbname?retryWrites=true&w=majority";
    const client = new MongoClient(url);
 
    // The database to use
    const dbName = "test";
   

    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "people"
        const col = db.collection("people");

        // Construct a document                                                                                                                                                              
        let updatedDocument = {
            "name": { "first": "Alan", "last": "Turing" },
            "birth": new Date(2012, 5, 23), // June 23, 1912                                                                                                                                 
            "death": new Date(2054, 5, 7),  // June 7, 1954                                                                                                                                  
            "contribs": [ "Turing machine", "Turing test", "Turingery" ],
            "views": 1250000
        }

        col.update(
            {"name.first":"Alan" },   // Query parameter
            updatedDocument,
            { upsert: true }      // Options
         )
         

       } catch (err) {
        console.log(err.stack);
    }

    finally {
       await client.close();

   }
})

router.get('/remove', async(req, res, next) => {

    const url = "mongodb+srv://admin:OyDiI2qNWvvVGreF@cluster0-qjfez.mongodb.net/dbname?retryWrites=true&w=majority";
    const client = new MongoClient(url);
 
    // The database to use
    const dbName = "test";
   

    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "people"
        const col = db.collection("people");


        col.remove(
            {"name.first":"Alan" },   // Query parameter
            { justOne: true }      // Options
         )
         

       } catch (err) {
        console.log(err.stack);
    }

    finally {
       await client.close();

   }
})


async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function listWords(doc)
{
    console.log(JSON.stringify(doc, null, 4));
    docs.push(JSON.stringify(doc, null, 4));
};

async function errorFunc(error) {
    if(error)console.log(error);
 }
 
 

module.exports = router;