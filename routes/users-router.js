const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/authMiddleware");

const usersController = require("../controllers/users-controller");

router.get("/", userAuthentication(["admin"]), usersController.getAllUsers);

router.post("/create", usersController.createUser);

router.put("/approve/:id", userAuthentication(["admin"]), usersController.approveUser);

router.delete("/:id", userAuthentication(["admin"]), usersController.deleteUser);

router.put("/:id", userAuthentication(["admin", "staff"]), usersController.updateUser);

router.get("/:id", userAuthentication(["admin", "staff"]), usersController.getSingleUser);

router.post("/login", usersController.authenticateUser);

module.exports = router;
