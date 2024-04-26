
const { serial_number_collection ,land_registration_collection} = require('../../Collections/admin_collection');

const get_serialized_booking = async (req, res, next) => {
    try {
        const find = await serial_number_collection.find({}).toArray();
        if (find.length === 0) {
            await serial_number_collection.insertOne({ booking: 0 });
        }
        const serial = await serial_number_collection.findOne({});
        const booking = serial.booking;
        const newSerial = booking + 1;
        await serial_number_collection.updateOne({}, { $set: { booking: newSerial } });
        res.send({ status: true, data: booking });

    } catch (error) {
        // Handle errors
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}


const add_land_registration = async (req, res, next) => {
    const data = req.body
    await land_registration_collection.insertOne(data)
    res.send({
        status: true, message: 'your land registration add  done successfully'
    })
}


const get_preview = async (req, res, next) => {
    console.log(req.query.id, '*******')
    try {
        const query = { _id: new ObjectId(req.query.id) }; 
        console.log(query, '******')
        // Corrected object property name
        const data = await land_registration_collection.findOne(query);
        res.send({ status: true, data: data });
    } catch (err) {
        next(err); // Forwarding error to the error handling middleware
    }
}


const get_user_land = async (req, res, next) => {
    try {
        const query = { userEmail: req.query.email }; // Corrected object property name
        const datas = await land_registration_collection.find(query).sort({date : -1}).toArray();
        res.send({ status: true, length: datas.length, data: datas }); // Corrected 'length' typo
    } catch (err) {
        next(err); // Forwarding error to the error handling middleware
    }
};

const get_all_land = async(req,res,next)=>{

    const resutl = await land_registration_collection.find({}).toArray()
    res.send({ status: true, length: datas.length, data: resutl }); // Corrected 'length' typo

}


// delete booking
const delete_land_registration = async (req, res, next) => {
    try {
        const id = req.query.id;
        await land_registration_collection.deleteOne({ _id: new ObjectId(id) });

        const io = req.app.get('socketio');
        io.emit('bookingDeleted', id);

        res.send({
            status: true,
            message: 'Land Registration Deleted Successfully',
            data: id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        });
    }
}


// edit booking
const edit_land_registration = async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.query.id;
        await land_registration_collection.updateOne({ _id: new ObjectId(id) }, { $set: body });
        res.send({
            status: true,
            message: 'Land Registration Updated Successfully',
            data: id
        });
    } catch (err) {
        next(err)
    }
}


module.exports = {
    get_serialized_booking,
    get_preview,
    get_all_land,
    get_user_land,
    delete_land_registration,
    edit_land_registration,
    add_land_registration
};
