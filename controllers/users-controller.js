const Joi = require("joi");
const bcrypt = require("bcryptjs");

const { User } = require("../models");

const schema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
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

    const user = {
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
      gender: value.gender,
      role: value.role,
      address: value.address,
      password: bcrypt.hashSync(value.password, 4),
    };

    const savedUser = await User.create({ message: "User added", data: user });

    res.status(200).json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

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
    res.status(200).json({ message: "User Updated", data: updatedUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getSingleUser = getSingleUser;
