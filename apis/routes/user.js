const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authorization");
const auth = require("../middlewares/checkAuth")
const UserController = require("../Controller/user")




router.post("/login", AuthController.Login);
router.post("/addUser", auth.adminAuth, UserController.addUser);
router.get("/dashboard", auth.adminAuth, UserController.dashboard);
router.get("/users", auth.adminAuth, UserController.getAllUsers);






module.exports = router