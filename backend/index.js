// Express setup
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
Some updates that you need to add to your file
- install dotenv package and load it
- change url=process.env.MONGO_URL
The other implementations can remain the same.
*/

// Load environment variable
require('dotenv').config()

// Mongo setup
const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL
const client = new MongoClient(url);

// This is for testing, and you should set your own db and table
const dbName = 'testDB';
const collectionName = "testCollection";

const database = client.db(dbName);
const collections = database.collection(collectionName);

// Implementation details
async function setup() {
    try {
      const doc = {key: 1};
      const filter = {key: 1};
      const result = await collections.updateOne(
        filter,
        { $setOnInsert: doc },
        { upsert: true }
      );
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      );
    } catch (error) {
        console.log(error);
    }
}

async function get_test() {
    try {
        const query = { key: 1 };
        const options = { projection: { _id: 0 } };

        const doc = await collections.findOne(query, options);
        return doc;
    } catch (error) {
        console.log(error);
    }
}

app.get('/test', async (req, res) => {
    console.log('GET /test');
    try {
        await setup();

        const doc = await get_test();
        res.send(doc);
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});