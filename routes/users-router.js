const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.get("/", usersController.getAllUsers);

router.post("/create", usersController.createUser);

router.delete("/:id", usersController.deleteUser);

router.put("/:id", usersController.updateUser);

router.get("/:id", usersController.getSingleUser);

module.exports = router;
