const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://sea-property-ltd:sea-property-ltd@sea-property-ltd.swfflkv.mongodb.net/?retryWrites=true&w=majority&appName=sea-property-ltd`;
// const uri = "mongodb://localhost:27017";

// MongoDB Connection
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

// All Collection For Admin {Admin Collections}
const user_collection = client.db("users").collection("users");
module.exports = { user_collection };
