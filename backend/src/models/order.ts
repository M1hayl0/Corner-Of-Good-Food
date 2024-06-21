import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        guest: String,
        restaurantName: String,
        restaurantAddress: String,
        cart: Array,
        totalPrice: Number,
        status: String, //can be waiting, accepted, rejected
        estimatedTime: String,
        date: Date,
        dateAcceptReject: Date
    }, {
        versionKey: false  
    }
)

export default mongoose.model("OrderModel", orderSchema, "orders")
