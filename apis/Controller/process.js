const Process = require("../Models/process.model")


exports.addProcess = async (req, res) =>{
    try {
        const operation = await Process.create(req.body)
        operation.totalPrintingCost = req.body.pricePerPaper * req.body.papersPerUnit * req.body.unitsNO
        operation.profit = req.body.paidPrice - operation.totalPrintingCost
        const operationSeconds = (req.body.papersPerUnit * req.body.unitsNO) / (Number(process.env.rate) * operation.machinesNO)
        console.log(operationSeconds)
        const EFT = new Date(operation.startedAt.getTime() + operationSeconds * 1000)
        operation.EFT = EFT
        await operation.save()
        return res.status(200).json({"message": "operation added"})
        
    } catch (err) {
        res.status(400).json({"message": err.message})
        
    }
};






exports.endProcess = async (req, res) =>{
    try {
        
        const operationID = req.body.processID
        const operation = await Process.findById(operationID)
        finishDate = new Date()
        finishDate.setHours(finishDate.getHours() + 3)
        operation.endedAt = finishDate
        operation.status = "FINISHED"
        await operation.save()
        return res.status(200).json({"message": "operation added"})
        
    } catch (err) {
        res.status(400).json({"message": err.message})
        
    }
};

exports.getAllProcesses = async (req, res) => {
    try {
        const start = parseInt(req.query.start) || 0
        const end = parseInt(req.query.end) || 100
        const query = {}

        
        req.query.phoneNO ? query.phoneNO = req.query.phoneNO : null;
        req.query.papersTh ? query.papersCount = {$gte: req.query.papersTh} : null;
        req.query.priceTH ? query.paidPrice = {$gte: req.query.papersTh} : null;
        
        console.log(query)
             



        const operations = await Process.find({}).sort({"startedAt": -1})
        return res.status(200).json({"processes": operations})
    } catch (error) {
        res.status(400).json({"message": err.message})
    }
};