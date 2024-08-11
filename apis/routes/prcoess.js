const express = require("express");
const router = express.Router();
const auth = require("../middlewares/checkAuth")
const ProcessController = require("../Controller/process")



router.post("/addProcess", auth.staffAuth, ProcessController.addProcess)
router.put("/endProcess", auth.staffAuth, ProcessController.endProcess)
router.get("/processes", auth.staffAuth, ProcessController.getAllProcesses)




module.exports = router