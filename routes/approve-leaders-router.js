const express = require("express")

const router = express.Router()

const userAuthentication = require("../middlewares/authMiddleware");

const approveLeadersController = require("../controllers/approve-leaders-controller")

router.get("/current-year", approveLeadersController.getAllCurrentYearLeaders)

router.post("/approve", userAuthentication(["admin"]), approveLeadersController.createLeader)

router.delete("/:id", userAuthentication(["admin"]), approveLeadersController.deleteLeader)

router.put("/:id", userAuthentication(["admin"]), approveLeadersController.updateLeader)

module.exports = router