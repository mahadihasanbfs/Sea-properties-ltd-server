const { news_events_collection } = require("../../Collections/admin_collection");

const add_news_events =async (req, res, next) => {
    const body = req.body;
    try {
        const result = await news_events_collection.insertOne(body);
        res.send({
            status: true,
            message: "Your news event uploaded successfully"
        });
    } catch (err) {
        res.status(500).send({
            status: false,
            message: "Failed to upload news event"
        });
    }
};

const update_news_events = async(req,res,next)=>{
    const events_id = req.query.id
    const body = req.body
    try {
        const result = await news_events_collection.updateOne({ _id: new ObjectId(events_id) }, { $set: body });
        res.send({
            status: true,
            message: 'News Event Updated Successfully',
            data: events_id
        });
    } catch (err) {
        next(err)
    }
}

const delete_newsletter_by_id = async(req,res,next)=>{
    const id = req.query.id 
    try {
        const result = await news_events_collection.deleteOne({ _id: new ObjectId(id) });
        res.send({
            status: true,
            message: "Newsletter deleted successfully",
        });
    } catch (error) {
        next(error)
    }
}


const get_all_news_events =async(req,res,next)=>{
    try {
        const data = await news_events_collection.find().toArray();
        res.send({
            status: true,
            message: "News Events Found Successfully",
            data: data
        });
    } catch (error) {
       next(error) 
    }
}


const get_news_events_events_by_id = async(req,res,next)=>{
    const id = req.query.id
    try {
        const data = await news_events_collection.findOne({ _id: new ObjectId(id) });
        res.send({
            status: true,
            message: "News Events Found Successfully",
            data: data
        });
    } catch (error) {
       next(error) 
    }
}

module.exports = {
    add_news_events,
    update_news_events,
    get_all_news_events,
    delete_newsletter_by_id,
    get_news_events_events_by_id
}