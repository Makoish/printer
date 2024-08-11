const mongoose = require("mongoose")




const ProcessSchema = mongoose.Schema(
    {
        
        customer: { 
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true
        },

        staff: { // this is the who prints (الي شغال هناك)
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true
        },

        papersPerUnit: {
            type: Number,
            required: true
        },

        unitsNO: {
            type: Number,
            required: true
        },

        pricePerPaper:{
            type: Number,
            required: true
        },

        typeOfClosure:{
            type: String,
            required: true,
            enum: ["بشر", "تقعيب"]
        },

        paidPrice: {
            type: Number,
            required: true
        },

        totalPrintingCost: {
            type: Number,
        },

        profit: {
            type: Number
        },

        startedAt: {
            type: Date,
            default: () => {
              const currentDate = new Date();
              currentDate.setHours(currentDate.getHours() + 3);
              return currentDate;
            }
        },

        endedAt: {
            type: Date,
            default: () => {
              const currentDate = new Date();
              currentDate.setHours(currentDate.getHours() + 3);
              return currentDate;
            }
        },

        EFT: {
            type: Date
        }

    }
)



module.exports = ProcessSchema