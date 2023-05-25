const Joi = require("joi");
const sequelize = require("sequelize");

const { Candidate, Post, User, Vote, CampaignPermission, VotesPermission } = require("../models");

const schema = Joi.object({
    postId: Joi.string().required(),
    plans: Joi.string().required(),
    image: Joi.string().required(),
});

// Getting all candidates
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            include: [Post, { model: User, attributes: { exclude: ["password"] } }],
        });
        res.status(200).json(candidates);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Getting all current year candidates
const getAllCurrentCandidates = async (req, res) => {
    try {
        const todaysDate = new Date();
        const getCurrentYear = todaysDate.getFullYear();

        const candidates = await Candidate.findAll({
            where: { electionYear: getCurrentYear, isApproved: true },
            include: [
                Post,
                {
                    model: User,
                    attributes: { exclude: ["password"] },
                },
            ],
        });
        res.status(200).json(candidates);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Get single Candidate
const getSingleCandidate = async (req, res) => {
    try {
        const id = req.params.id;
        const candidate = await Candidate.findByPk(id, {
            include: [Post, { model: User, attributes: { exclude: ["password"] } }],
        });

        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        res.status(200).json(candidate);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Adding new candidate
const createCandidate = async (req, res) => {
    try {
        const campaignStatus = await CampaignPermission.findAll();
        if (!campaignStatus[0].status) {
            return res
                .status(400)
                .json({ error: "Campaign has not started yet" });
        }

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: error.details[0].message });
        }

        const todaysDate = new Date();
        const getCurrentYear = todaysDate.getFullYear();

        const existingCandidate = await Candidate.findOne({
            where: { userId: req.userData.id },
        });
        if (existingCandidate && existingCandidate.electionYear == getCurrentYear) {
            return res.status(400).json({
                message: "You cannot have more than one post in the same year",
            });
        }
        const candidate = {
            userId: req.userData.id,
            postId: value.postId,
            plans: value.plans,
            electionYear: getCurrentYear,
            image: value.image,
            isApproved: false,
        };

        const savedCandidate = await Candidate.create(candidate);

        const addedCandidateWithPost = await Candidate.findByPk(savedCandidate.id, {
            include: [Post],
        });

        res
            .status(200)
            .json({ message: "Candidate added", data: addedCandidateWithPost });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Candidate approval
const approveCandidate = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "Candidate ID is required" });
        }
        const id = req.params.id;
        const existingCandidate = await Candidate.findByPk(id);
        if (!existingCandidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        if (existingCandidate.isApproved) {
            return res.status(404).json({ error: "Candidate already approved" });
        }
        const approvedCandidate = await existingCandidate.update({
            isApproved: true,
        });
        res.status(200).json({ message: "Candidate", data: approvedCandidate });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Deleting Candidate
const deleteCandidate = async (req, res) => {
    try {
        if (!req.params.id) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: "ID is required" });
        }
        const id = req.params.id;
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        await candidate.destroy();
        res.status(200).json({ message: "Candidate deleted" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Updating candidate
const updateCandidate = async (req, res) => {
    try {
        if (!req.params.id) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: "ID is required" });
        }
        const id = req.params.id;
        const { postId, plans, image } = req.body;

        const candidate = await Candidate.findByPk(id);

        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        const updatedCandidate = await candidate.update({
            postId,
            plans,
            image,
        });

        const updatedCandidateWithPost = await Candidate.findByPk(
            updatedCandidate.id,
            { include: [Post] }
        );

        res
            .status(200)
            .json({ message: "Candidate Updated", data: updatedCandidateWithPost });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Getting all Votes that happened
const getAllVotes = async (req, res) => {
    try {
        const candidatesVoted = await Candidate.findAll({
            include: [
                User,
                Post,
                {
                    model: Vote,
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("Votes.id")), "voteCounts"],
                ],
            },
            group: ["Candidate.id"],
        });

        res.status(200).json(candidatesVoted);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Getting all current year candidates votes
const getAllCurrentVotes = async (req, res) => {
    try {
        const todaysDate = new Date();
        const getCurrentYear = todaysDate.getFullYear();

        const candidatesVoted = await Candidate.findAll({
            where: { electionYear: getCurrentYear },
            include: [
                User,
                Post,
                {
                    model: Vote,
                    attributes: [],
                },
            ],
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("Votes.id")), "voteCounts"],
                ],
            },
            group: ["Candidate.id"],
        });

        res.status(200).json(candidatesVoted);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Adding new vote
const voteCandidate = async (req, res) => {
    try {
        const votingStatus = await VotesPermission.findAll();
        if (!votingStatus[0].status) {
            return res
                .status(400)
                .json({ error: "Voting period has not started yet" });
        }
        if (!req.body.candidateId) {
            return res.status(400).json({ message: "Please select a candidate" });
        }
        const todaysDate = new Date();
        const getCurrentYear = todaysDate.getFullYear();

        const isCandidateExixt = await Candidate.findByPk(req.body.candidateId)

        if (!isCandidateExixt) {
            return res.status(400).json({ message: "Select candidate is not found" });
        }

        const hasUserVoteCandidate = await Vote.findOne({
            where: {
                userId: req.userData.id,
                voteYear: getCurrentYear,
                candidateId: req.body.candidateId,
            },
        });
        if (hasUserVoteCandidate) {
            return res.status(400).json({ message: "You cannot vote this candidate twice", hasUserVoteCandidate: true });
        }

        const candidate = req.body
        candidate.userId = req.userData.id
        candidate.voteYear = getCurrentYear

        const savedVote = await Vote.create(candidate);

        res.status(200).json({ message: `Voting ${req.userData.fullName} is done successfully`, data: savedVote });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getAllCandidates,
    createCandidate,
    deleteCandidate,
    updateCandidate,
    getSingleCandidate,
    approveCandidate,
    getAllCurrentCandidates,
    getAllCurrentVotes,
    voteCandidate,
    getAllVotes,
};
