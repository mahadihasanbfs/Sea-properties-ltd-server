const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://sea-property-ltd:sea-property-ltd@sea-property-ltd.swfflkv.mongodb.net/?retryWrites=true&w=majority&appName=sea-property-ltd`;
// const uri = "mongodb://localhost:27017";

// MongoDB Connection
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

// All Collection For Admin {Admin Collections}
const blog_collection = client.db("content").collection("blogs");
const newsletter_collection = client.db("content").collection("newsletter");
const contact_collection = client.db("content").collection("contact");
const project_collection = client.db("projects").collection("project");
const installment_collection = client.db("projects").collection("installment");
const booking_collection = client.db("projects").collection("booking");
const testimonial_colection= client.db("projects").collection("testimonial");
const serial_number_collection = client.db("projects").collection("serial")
const land_registration_collection = client.db("projects").collection("land_registration")

module.exports = {
  blog_collection,
  project_collection,
  installment_collection,
  newsletter_collection,
  contact_collection,
  booking_collection,
  testimonial_colection,
  serial_number_collection,
  land_registration_collection
};
