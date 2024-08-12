const bcrypt = require('bcrypt');
const User = require("../Models/user.model")
const Process = require("../Models/process.model")




exports.addUser = async (req, res) => {
    try {
        
        const phoneNO = req.body.phoneNO
        const user = await User.findOne({"phoneNO": phoneNO})

        if (user)
            throw new Error("User exists")
        if (req.body.password)
            req.body.password = await bcrypt.hash(req.body.password, Number(process.env.hashRounds));
        const _ = await User.create(req.body)
        return res.status(201).json({"message": "User created"})

        

       
    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};


exports.dashboard = async (req, res) => {
    try {
        
        

        let currDate = new Date()
        let day = currDate.getDate(); 
        let month = currDate.getMonth()
    
        let dayProfit = 0
        let monthProfit = 0
        let totalProfit = 0
        let barCharts = []
        let piCharts = []
        let monthesBarCharts = {}
        const monthMap = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"};

        const operations = await Process.find({})

        
        for (let i = 0; i<operations.length; i++){
            if (operations[i].status == "FINISHED")
                totalProfit+=operations[i].profit; 
        }
    

    
        for (let i = 0; i<operations.length; i++){
            if (operations[i].status == "FINISHED" && operations[i].startedAt.getMonth() == month){
                monthProfit+= operations[i].profit;
            }
        }
    

        for (let i = 0; i<operations.length; i++){
          
            if (operations[i].status == "FINISHED" && operations[i].startedAt.getDate() == day)
                dayProfit+= operations[i].profit
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////


    
    
        let monthesBarChartPapers = {}
        for (let i = 0; i<operations.length; i++){
            if (operations[i].status == "FINISHED"){
                if (monthMap[operations[i].startedAt.getMonth()] in monthesBarCharts){ 
                    monthesBarCharts[monthMap[operations[i].startedAt.getMonth()]] += operations[i].profit
                    monthesBarChartPapers[monthMap[operations[i].startedAt.getMonth()]] += operations[i].papersPerUnit * operations[i].unitsNO
                }
                else{
                    monthesBarCharts[monthMap[operations[i].startedAt.getMonth()]] = operations[i].profit
                    monthesBarChartPapers[monthMap[operations[i].startedAt.getMonth()]] = operations[i].papersPerUnit * operations[i].unitsNO
                }

            }
        }

       
        
        barCharts.push({"monthlyProfit": monthesBarCharts})
        barCharts.push({"monthlyUsedPapers": monthesBarChartPapers})
        

        const topThreeCustomers = await Process.aggregate([

            {
                $match: {
                    status: "FINISHED" // Only include transactions with status "accepted"
                }
            },

            {
                $group: {
                    _id: "$customer",
                    totalProfit: { $sum: "$profit" }
                }
            },
            {
                $project: {
                    _id: 0, 
                    customer: "$_id", 
                    totalProfit: 1 
                }
            },

            {
                $sort: { totalProfit: -1 } 
            }
        ]);



        

        const closureTypeRatio = await Process.aggregate([

            {
                $match: {
                    status: "FINISHED" // Only include transactions with status "accepted"
                }
            },

            {
                $group: {
                    _id: "$typeOfClosure",
                    ratio: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0, 
                    typeOfClosure: "$_id", 
                    ratio: 1
                }
            },

        ]);

        let cc = 0
        for (let i = 0; i<closureTypeRatio.length; i++){
        cc += closureTypeRatio[i].ratio
        }

        let bashr2Tak3eeb = {}
        for (let i = 0; i<closureTypeRatio.length; i++)
            bashr2Tak3eeb[closureTypeRatio[i].typeOfClosure]= (closureTypeRatio[i].ratio* 100)/ cc 


        piCharts.push({"ClosureRatio": bashr2Tak3eeb})
        

        
        for (let i = 0; i<topThreeCustomers.length; i++){
            const user = await User.findById(topThreeCustomers[i].customer)
            topThreeCustomers[i].customer = user.fullName
        }


    



        

        barCharts.push({"top3Customers": topThreeCustomers})
        return res.status(200).json({"barCharts": barCharts, "PiCharts": piCharts})

       
    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};




exports.getAllUsers = async (req, res) => {
    try {
        
        const start = parseInt(req.query.start) || 0
        const end = parseInt(req.query.end) || 100
        const query = {}
      

        
        req.query.phoneNO ? query.phoneNO = req.query.phoneNO : null;
        req.query.fullName? query.fullName = new RegExp(req.query.fullName, 'i') : null;

        const users = await User.find(query).select('-password -__v');

        return res.status(200).json({"Users": users.slice(start, end)}) 

        

       
    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};




exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if (!user)
            throw new Error("User doesn't exist")

        await User.findByIdAndDelete(id)
        

        return res.status(200).json({"message": "user deleted"}) 

        

       
    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};


exports.editUser = async (req, res) => {
    try {

        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user)
            throw new Error("User doesn't exist")
        await User.findByIdAndUpdate(_id, req.body)
        return res.status(200).json({"message": "user updated"}) 

        

       
    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};



exports.getUser = async (req, res) => {
    try {
        
    
        const _id = req.params.id
        const user = await User.findById(_id).select('-password -__v');
    
        return res.status(200).json({"User": user}) 

        

       
    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};




