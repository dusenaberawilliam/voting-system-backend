const Joi = require("joi");

const { ApprovedLeaders, Candidate, User, Vote } = require("../models");

const sequelize = require("sequelize");

const schema = Joi.object({
    candidateId: Joi.string().required(),
    leadershipStartDate: Joi.date().required(),
    leadershipEndDate: Joi.date().required(),
});

const todaysDate = new Date();
const getCurrentYear = todaysDate.getFullYear();

// Getting all Leaders
const getAllCurrentYearLeaders = async (req, res) => {
    try {
        const currentYearLeaders = await Candidate.findAll({
            electionYear: getCurrentYear,
            include: [
                {
                    model: ApprovedLeaders,
                    required: true,
                },
                User, Vote,
            ],
        });

        const formattedLeaders = []

        currentYearLeaders.map((item) => {
            formattedLeaders.push({
                id: item.id,
                userId: item.userId,
                plans: item.plans,
                electionYear: item.electionYear,
                image: item.image,
                isApproved: item.isApproved,
                createdAt: item.ApprovedLeader.createdAt,
                updatedAt: item.ApprovedLeader.updatedAt,
                fullName: item.User.fullName,
                email: item.User.email,
                phone: item.User.phone,
                gender: item.User.gender,
                role: item.User.role,
                address: item.User.address,
                votesCount: item.Votes.length
            })
        })

        res.status(200).json(formattedLeaders);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Adding new Leader
const createLeader = async (req, res) => {
    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: error.details[0].message });
        }

        const existingCandidate = await Candidate.findOne({
            where: { id: value.candidateId },
        });
        if (!existingCandidate) {
            return res.status(400).json({ message: "Candidate not found" });
        }

        const isCandidateApproved = await ApprovedLeaders.findOne({
            where: { candidateId: value.candidateId },
        });
        if (
            isCandidateApproved &&
            existingCandidate.electionYear == getCurrentYear
        ) {
            return res
                .status(400)
                .json({ message: "Cannot approve candidate twice" });
        }

        await ApprovedLeaders.create(value);

        const savedLeader = await Candidate.findOne({
            where: { id: value.candidateId },
            include: [
                User,
                {
                    model: ApprovedLeaders,
                    required: true,
                },
            ],
        });

        res.status(200).json({ message: "Leader approved", data: savedLeader });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Edit (Update)
const updateLeader = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "ID is required" });
        const leader = await ApprovedLeaders.findByPk(req.params.id);
        if (!leader) {
            return res.status(404).json({ error: "Leader not found" });
        }
        const { leadershipStartDate, leadershipEndDate } = req.body
        const updatedLeader = await leader.update({
            leadershipStartDate,
            leadershipEndDate,
        })
        res.status(200).json({ message: "Updated", data: updatedLeader })
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
}

// Delete
const deleteLeader = async (req, res) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "ID is required" });

        const leader = await ApprovedLeaders.findByPk(req.params.id);
        if (!leader) {
            return res.status(404).json({ error: "Leader not found" });
        }
        await leader.destroy();
        res.status(200).json({ message: "Leader deleted" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getAllCurrentYearLeaders,
    createLeader,
    deleteLeader,
    updateLeader
};
