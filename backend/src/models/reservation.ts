import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema(
    {
        restaurantName: String,
        restaurantAddress: String,
        table: Object,
        date: Date,
        seats: Number,
        description: String,
        guest: String,
        comment: String,
        rating: Number,
        waiter: String,
        status: String, //can be waiting, accepted, rejected
        guestAppeared: Boolean,
        hours: Number,
        reasonForRejection: String
    }, {
        versionKey: false  
    }
)

export default mongoose.model("ReservationModel", reservationSchema, "reservations")
