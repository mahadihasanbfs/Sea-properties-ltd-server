const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = mongodb+srv://${process.env.DB}:${process.env.DB}@cluster0.hhmsmpq.mongodb.net/?retryWrites=true&w=majority;

// MongoDB Connection
const client = new MongoClient(uri, {

    serverApi: ServerApiVersion.v1,
});

const ImagesCollections = client.db('Image').collection("Images");

module.exports = { ImagesCollections }
