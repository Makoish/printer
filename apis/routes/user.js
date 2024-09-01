const express = require("express");
const router = express.Router();
const AuthController = require("../Controller/authorization");
const auth = require("../middlewares/checkAuth")
const UserController = require("../Controller/user")




router.post("/login", AuthController.Login);
router.post("/addUser", auth.adminAuth, UserController.addUser);
router.get("/dashboard", auth.adminAuth, UserController.dashboard);
router.get("/users", auth.adminAuth, UserController.getAllUsers);
router.get("/:id", auth.adminAuth, UserController.getUser);
router.delete("/:id", auth.adminAuth, UserController.deleteUser);
router.put("/:id", auth.adminAuth, UserController.editUser);







module.exports = router