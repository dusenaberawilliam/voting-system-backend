const { CampaignPermission, VotesPermission } = require("../models");

// Change status to allow canditate post submission
const candidateCampaignPermission = async (req, res) => {
    try {
        const getStatus = await CampaignPermission.findAll();
        if (!getStatus.length) {
            return res.status(404).json({ error: "No data found" });
        }
        if (getStatus[0].status) {
            return res
                .status(406)
                .json({ error: "Candidate campaign is already allowed to start" });
        }
        const updateStatus = await CampaignPermission.update(
            { status: true },
            { where: { id: getStatus[0].id } }
        );
        res
            .status(200)
            .json({
                message: "Candidate campaign is now allowed to start",
                data: updateStatus,
            });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Change status to stop or pause canditate post submission
const candidateCampaignDenial = async (req, res) => {
    try {
        const getStatus = await CampaignPermission.findAll();
        if (!getStatus.length) {
            return res.status(404).json({ error: "No data found" });
        }
        if (!getStatus[0].status) {
            return res
                .status(406)
                .json({ error: "Candidate campaign is already paused" });
        }
        const updateStatus = await CampaignPermission.update(
            { status: false },
            { where: { id: getStatus[0].id } }
        );
        res
            .status(200)
            .json({
                message: "Candidate campaign is now paused",
                data: updateStatus,
            });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Change the status to allow starting of votes
const startVotingsPermission = async (req, res) => {
    try {
        const getStatus = await VotesPermission.findAll();
        if (!getStatus.length) {
            return res.status(404).json({ error: "No data found" });
        }
        if (getStatus[0].status) {
            return res
                .status(406)
                .json({ error: "Votings is already allowed to start" });
        }
        const updateStatus = await VotesPermission.update(
            { status: true },
            { where: { id: getStatus[0].id } }
        );
        res
            .status(200)
            .json({ message: "Votings is now allowed to start", data: updateStatus });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Change the status to stop or pause of votings
const votingsDenial = async (req, res) => {
    try {
        const getStatus = await VotesPermission.findAll();
        if (!getStatus.length) {
            return res.status(404).json({ error: "No data found" });
        }
        if (!getStatus[0].status) {
            return res
                .status(406)
                .json({ error: "Voting proccess is already paused" });
        }
        const updateStatus = await VotesPermission.update(
            { status: false },
            { where: { id: getStatus[0].id } }
        );
        res
            .status(200)
            .json({ message: "votings process is now paused", data: updateStatus });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    candidateCampaignPermission,
    candidateCampaignDenial,
    startVotingsPermission,
    votingsDenial,
};
