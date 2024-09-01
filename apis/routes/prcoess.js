const express = require("express");
const router = express.Router();
const auth = require("../middlewares/checkAuth")
const ProcessController = require("../Controller/process")



router.post("/addProcess", auth.staffAuth, ProcessController.addProcess)
router.put("/endProcess", auth.staffAuth, ProcessController.endProcess)
router.get("/admin/processes", auth.adminAuth, ProcessController.getAllProcesses)
router.get("/staff/processes", auth.staffAuth, ProcessController.getAllProcessesStaff)
router.get("/:id", auth.staffAuth, ProcessController.getProcess)
router.delete("/:id", auth.adminAuth, ProcessController.deleteProcess)





module.exports = router