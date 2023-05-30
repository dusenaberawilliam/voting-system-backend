const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/authMiddleware");

const candidatesController = require("../controllers/candidates-controller");

router.get("/", userAuthentication(["admin"]), candidatesController.getAllCandidates);

router.get("/current", userAuthentication(["admin", "staff"]), candidatesController.getAllCurrentCandidates);

router.post("/", userAuthentication(["staff"]), candidatesController.createCandidate);

router.put("/approve/:id", userAuthentication(["admin"]), candidatesController.approveCandidate);

router.delete("/:id", userAuthentication(["admin", "staff"]), candidatesController.deleteCandidate);

router.put("/:id", userAuthentication(["admin", "staff"]), candidatesController.updateCandidate);

router.get("/single/:id", userAuthentication(["admin", "staff"]), candidatesController.getSingleCandidate);

router.get("/current-votes", userAuthentication(["admin", "staff"]), candidatesController.getAllCurrentVotes);

router.get("/all-votes", userAuthentication(["admin", "staff"]), candidatesController.getAllVotes);

router.post("/make-vote", userAuthentication(["admin", "staff"]), candidatesController.voteCandidate);


module.exports = router;
