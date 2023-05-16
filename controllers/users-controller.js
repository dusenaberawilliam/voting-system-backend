const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models");

const schema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
});

// Getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get single user
const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Adding new user
const createUser = async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: error.details[0].message });
    }

    const existingUser = await User.findOne({ where: { email: value.email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const user = {
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
      gender: value.gender,
      role: "staff",
      isApproved: false,
      address: value.address,
      password: bcrypt.hashSync(value.password, 4),
    };

    const savedUser = await User.create(user);

    const { password, ...excludePassword } = savedUser.toJSON();

    res.status(200).json({ message: "User added", data: excludePassword });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const approveUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: "ID is required" });
    }
    const id = req.params.id;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const approvedUser = await user.update({
      isApproved: true,
    });

    const { password, ...excludePassword } = approvedUser.toJSON();

    res.status(200).json({ message: "User approved", data: excludePassword });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Deleting user
const deleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: "ID is required" });
    }
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: "ID is required" });
    }
    const id = req.params.id;
    const { fullName, email, phone, gender, role, address } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const updatedUser = await user.update({
      fullName,
      email,
      phone,
      gender,
      role,
      address,
    });

    const { password, ...excludePassword } = updatedUser.toJSON();

    res.status(200).json({ message: "User Updated", data: excludePassword });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "user doesn't exist" });
    }
    if (!user.isApproved) {
      return res.status(406).json({ error: "Your account is not approved yet" });
    }
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.json({ error: "Wrong username or password" });
      }
      const accessToken = sign(
        { email: user.email, id: user.id, name: user.name, role: user.role },
        process.env.SECRET_KEY_TOKEN, { expiresIn: process.env.TOKEN_EXPIRES_IN }
      );

      res.status(200).json({
        token: accessToken,
        fullName: user.fullName,
        id: user.id,
        email: user.email,
        role: user.role,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getSingleUser,
  authenticateUser,
  approveUser
};
