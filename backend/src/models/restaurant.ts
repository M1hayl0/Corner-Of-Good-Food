import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema(
    {
        name: String,
        address: String,
        type: String,
        waiters: Array,
        phone: String,
        map: String,
        canvas: Array,
        workingTime: Array,
        menu: Array,
        description: String
    }, {
        versionKey: false  
    }
)

export default mongoose.model("RestaurantModel", restaurantSchema, "restaurants")
