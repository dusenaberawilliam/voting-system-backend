const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/authMiddleware");

const candidatesController = require("../controllers/candidates-controller");

router.get("/", userAuthentication(["admin"]), candidatesController.getAllCandidates);

router.get("/current", userAuthentication(["admin", "staff"]), candidatesController.getAllCurrentCandidates);

router.post("/", userAuthentication(["admin"]), candidatesController.createCandidate);

router.put("/approve/:id", userAuthentication(["admin"]), candidatesController.approveCandidate);

router.delete("/:id", userAuthentication(["admin", "staff"]), candidatesController.deleteCandidate);

router.put("/:id", userAuthentication(["admin", "staff"]), candidatesController.updateCandidate);

router.get("/:id", userAuthentication(["admin", "staff"]), candidatesController.getSingleCandidate);


module.exports = router;
