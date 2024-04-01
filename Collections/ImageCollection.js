const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://sea-property-ltd:seapropertyltd@sea-property-ltd.swfflkv.mongodb.net/?retryWrites=true&w=majority&appName=sea-property-ltd`;
// const uri = "mongodb://localhost:27017";

// MongoDB Connection
const client = new MongoClient(uri, {

    serverApi: ServerApiVersion.v1,
});

const image_collection = client.db('Image').collection("Images");

module.exports = { image_collection }
