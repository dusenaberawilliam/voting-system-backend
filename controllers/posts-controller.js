const Joi = require("joi");

const { Post } = require("../models");

const schema = Joi.object({
    postName: Joi.string().required(),
});

// Getting all Posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ attributes: { exclude: ["password"] } });
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Get single post
const getSinglePost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Adding new post
const createPost = async (req, res) => {
    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: error.details[0].message });
        }

        const existingPost = await Post.findOne({ where: { postName: value.postName } });
        if (existingPost) {
            return res.status(400).json({ message: 'Already has this post' });
        }


        const savedPost = await Post.create(value);

        res.status(200).json({ message: "Post added", data: savedPost });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Deleting post
const deletePost = async (req, res) => {
    try {
        if (!req.params.id) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: "ID is required" });
        }
        const id = req.params.id;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        await post.destroy();
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

// Updating post
const updatePost = async (req, res) => {
    try {
        if (!req.params.id) {
            return res
                .status(400)
                .json({ message: "Invalid data", error: "ID is required" });
        }
        const id = req.params.id;
        const { postName } = req.body;

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const updatedPost = await post.update({
            postName
        });

        res.status(200).json({ message: "Post Updated", data: updatedPost });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getAllPosts,
    createPost,
    deletePost,
    updatePost,
    getSinglePost,
};
