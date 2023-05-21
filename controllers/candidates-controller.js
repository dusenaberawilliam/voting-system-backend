const Joi = require("joi");

const { Candidate, Post, User } = require("../models");

const schema = Joi.object({
    postId: Joi.string().required(),
    plans: Joi.string().required(),
    image: Joi.string().required(),
});

// Getting all candidates
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            attributes: { exclude: ["password"] },
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
            where: { electionYear: getCurrentYear },
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

module.exports = {
    getAllCandidates,
    createCandidate,
    deleteCandidate,
    updateCandidate,
    getSingleCandidate,
    approveCandidate,
    getAllCurrentCandidates,
};
