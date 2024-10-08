const mongoose = require("mongoose")




const ProcessSchema = mongoose.Schema(
    {
        
        customer: { 
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },

        staff: { // this is the who prints (الي شغال هناك)
            type: mongoose.Schema.ObjectId,
            ref: "User",
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
            type: {
                Type: { type: String, enum: ["بشر", "تكعيب"] },
                isTransparent: { type : Boolean },
                coilNumber: { type: Number },
                price: { type: Number }
            },
            required: true,
            
        },

        typeOfPrint: {
            type: String,
            required: true,
            enum: ["single", "double"]
        },

        costOfClosure: {
            type: String,
            required: true
        },

        paidPrice: {
            type: Number
        },

        papersCount: { // for search query
            type: Number
        },

        totalPrintingCost: {
            type: Number,
        },

        status: {
            type: String,
            default: "RUNNING",
            enum: ["RUNNING", "FINISHED"]
        },

        machinesNO:{
            type: Number,
            required: true
        },

        profit: {
            type: Number
        },

        startedAt: {
            type: Date,
            default: Date.now()
        },

        endedAt: {
            type: Date,
        },

        EFT: {   //Estimated Finish Time
            type: Date
        }

    }
)



const Process = mongoose.model("Process", ProcessSchema);
module.exports = Process