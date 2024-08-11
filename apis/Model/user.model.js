const mongoose = require("mongoose")




const UserSchema = mongoose.Schema(
    {
        phoneNO: {
            type: String,
            required: true,
            unique: true
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



module.exports = UserSchema