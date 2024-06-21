import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: String, //for all users
        password: String, //for all users
        firstName: String, //for all users
        lastName: String, //for all users
        type: String, //for all users //can be admin, waiter or guest
        securityQuestion: String, //for guest and waiter
        securityAnswer: String, //for guest and waiter
        gender: String, //for guest and waiter //can be M or F
        address: String, //for guest and waiter
        phone: String, //for guest and waiter
        email: String, //for guest and waiter
        profileImageName: String, //for guest and waiter
        creditCard: String, //for guest and waiter
        status: String, //for all users
        didntAppearTimes: Number, //for guest
        restaurantName: String, //for waiter
        restaurantAddress: String //for waiter
    }, {
        versionKey: false  
    }
)

export default mongoose.model("UserModel", userSchema, "users")
