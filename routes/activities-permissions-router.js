const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/authMiddleware");

const activiesPermissionController = require("../controllers/activities-permissions-controller");

router.put(
    "/campaign-start-permit",
    userAuthentication(["admin"]),
    activiesPermissionController.candidateCampaignPermission
);

router.put(
    "/stop-campaigns",
    userAuthentication(["admin"]),
    activiesPermissionController.candidateCampaignDenial
);

router.put(
    "/voting-start-permission",
    userAuthentication(["admin"]),
    activiesPermissionController.startVotingsPermission
);

router.put(
    "/stop-votings",
    userAuthentication(["admin"]),
    activiesPermissionController.votingsDenial
);

module.exports = router;
