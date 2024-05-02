const { ObjectId } = require('mongodb');
const { testimonial_collection } = require('../../Collections/admin_collection');

// Add a testimonial
const add_testimonial = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await testimonial_collection.insertOne(body);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

// Get all testimonials
const get_testimonials = async (req, res, next) => {
    try {
        const testimonials = await testimonial_collection.find({}).toArray();
        res.send(testimonials);
    } catch (error) {
        next(error);
    }
};

// Delete a testimonial by ID
const delete_testimonial = async (req, res, next) => {
    try {
        const testimonialId = req.query.testimonialId; // Assuming the ID is provided as a route parameter
        const result = await testimonial_collection.deleteOne({ _id: new ObjectId(testimonialId) });
        res.send(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { add_testimonial, get_testimonials, delete_testimonial };
