const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/authMiddleware");

const postsController = require("../controllers/posts-controller");

router.get("/", userAuthentication(["admin", "staff"]), postsController.getAllPosts);

router.post("/", userAuthentication(["admin"]), postsController.createPost);

router.delete("/:id", userAuthentication(["admin"]), postsController.deletePost);

router.put("/:id", userAuthentication(["admin"]), postsController.updatePost);

router.get("/:id", userAuthentication(["admin", "staff"]), postsController.getSinglePost);


module.exports = router;
