const mongoose = require("mongoose")



const UserSchema = mongoose.Schema(
    {
        phoneNO: {
            type: String,
            required: true,
            unique: true
        },

        password:{ //not required cuz the projects needs this
            type: String,
        },

        fullName: {
            type: String,
            required: true,
        },

        address: {
            type: String
        },

        isAdmin: {
            type: Boolean,
            default: false
        },

        isStaff: {
            type: Boolean,
            default: false
        },

        isCustomer: {
            type: Boolean,
            default: false
        }

    }
)



const User = mongoose.model("User", UserSchema);
module.exports = User