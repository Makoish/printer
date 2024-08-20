const Process = require("../Models/process.model")
const User = require("../Models/user.model")



function filterTransactionsByTime(filter) {
    const today = new Date();
    let startDate;
    let endDate;

    if (filter === 'day') {
        // Daily filter
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (filter === 'month') {
        // Monthly filter
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (filter === 'year') {
        // Yearly filter
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
    } 
    return {startDate, endDate}
}



exports.addProcess = async (req, res) =>{
    try {
        const operation = await Process.create(req.body)
        operation.paidPrice = req.body.pricePerPaper * req.body.papersPerUnit * req.body.unitsNO
        operation.totalPrintingCost = Number(process.env.pricePerPaperActual) * req.body.papersPerUnit * req.body.unitsNO
        operation.profit = operation.paidPrice - operation.totalPrintingCost
        operation.papersCount = req.body.papersPerUnit * req.body.unitsNO
        const operationSeconds = (req.body.papersPerUnit * req.body.unitsNO) / (Number(process.env.rate) * operation.machinesNO)
        const EFT = new Date(operation.startedAt.getTime() + operationSeconds * 1000)
        operation.EFT = EFT
        let retEFT = new Date(operation.startedAt.getTime() + operationSeconds * 1000)
        retEFT.setHours(retEFT.getHours()+3)
        operation.papersCount = req.body.papersPerUnit * req.body.unitsNO
        await operation.save()
        return res.status(200).json({"message": "operation added", "price": operation.paidPrice, "papersUsed": operation.papersCount, "EFT": retEFT})
        
    } catch (err) {
        res.status(400).json({"message": err.message})
        
    }
};






exports.endProcess = async (req, res) =>{
    try {
        
        const operationID = req.body.processID
        const operation = await Process.findById(operationID)
        operation.endedAt = new Date()
        operation.status = "FINISHED"
        await operation.save()
        return res.status(200).json({"message": "operation ended"})
        
    } catch (err) {
        res.status(400).json({"message": err.message})
        
    }
};

exports.getAllProcesses = async (req, res) => {
    try {
        const start = parseInt(req.query.start) || 0
        const end = parseInt(req.query.end) || 100
        const query = {}
        const populateFilter = {}

        
        req.query.phoneNO ? populateFilter.phoneNO = req.query.phoneNO : null;
        req.query.papersTh ? query.papersCount = {$gte: req.query.papersTh} : null;
        req.query.priceTh ? query.paidPrice = {$gte: req.query.priceTh} : null;
        req.query.fullName? populateFilter.fullName = new RegExp(req.query.fullName, 'i') : null;
        req.query.status? query.status = req.query.status : null;
        if (req.query.period){
            const {startDate, endDate } = filterTransactionsByTime(req.query.period)
            query.startedAt = {$gte: startDate, $lt: endDate}
        }
        
        const users = await User.find(populateFilter)
        if (users){
            query.$or = [
                {"customer": {$in: users.map(obj => obj.id)}},
                {"staff": {$in: users.map(obj => obj.id)}}

            ]
        }

      
        const operations = await Process.find(query).populate({"path": "customer", "select": "phoneNO fullName"}).populate({"path": "staff", "select": "fullName"}).select("-__v")
        
        const operationsClone = operations.map(order => {
            const orderObject = order.toObject();
            return orderObject;
          });
        for (let i = 0; i < operationsClone.length; i++){
            operationsClone[i].startedAt.setHours(operationsClone[i].startedAt.getHours() + 3)
            operationsClone[i].endedAt ? operationsClone[i].endedAt.setHours(operationsClone[i].endedAt.getHours()+3 ): null;
            
        
        }

        
        



        return res.status(200).json({"processes": operationsClone.slice(start, end)})
    } catch (err) {
        res.status(400).json({"message": err.message})
    }
};



exports.getAllProcessesStaff = async (req, res) => {
    try {
        const start = parseInt(req.query.start) || 0
        const end = parseInt(req.query.end) || 100
        const query = {}
        const populateFilter = {}
     

        
        req.query.phoneNO ? populateFilter.phoneNO = req.query.phoneNO : null;
      
        const users = await User.find(populateFilter)
        if (users){
            query.$or = [
                {"customer": {$in: users.map(obj => obj.id)}},
                {"staff": {$in: users.map(obj => obj.id)}}
            ]
        }

        query.status = "RUNNING"

       
        const operations = await Process.find(query).populate({"path": "customer", "select": "phoneNO fullName"}).populate({"path": "staff", "select": "fullName"}).select("-__v")
        const operationsClone = operations.map(order => {
            const orderObject = order.toObject();
            return orderObject;
          });
        for (let i = 0; i < operationsClone.length; i++){
            operationsClone[i].startedAt.setHours(operationsClone[i].startedAt.getHours() + 3)
            operationsClone[i].endedAt ? operationsClone[i].endedAt.setHours(operationsClone[i].endedAt.getHours()+3 ): null;
            
        }

        
        



        return res.status(200).json({"processes": operationsClone.slice(start, end)})
    } catch (err) {
        res.status(400).json({"message": err.message})
    }
};



exports.getProcess = async (req, res) => {
    try {
        const id = req.params.id
     
        const operation = await Process.findById(id).select("-__v")
        const operationClone = operation.toObject();
        
        if (!operation) throw new Error ("operation doesn't exist");


        operationClone.startedAt ? operationClone.startedAt.setHours(operationClone.startedAt.getHours() + 3): null;
        operationClone.endedAt ? operationClone.endedAt.setHours(operationClone.endedAt.getHours()+3 ): null;
       
    

        
        



        return res.status(200).json({"processes": operationClone})
    } catch (err) {
        res.status(400).json({"message": err.message})
    }
};


exports.deleteProcess = async (req, res) => {
    try {
        const id = req.params.id
     
        const operation = await Process.findById(id)
        if (!operation)
            throw new Error("process doesn't exist")

        await Process.findByIdAndDelete(id)
        

        
        



        return res.status(200).json({"message": "Process Deleted"})
    } catch (err) {
        res.status(400).json({"message": err.message})
    }
};