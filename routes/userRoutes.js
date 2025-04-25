const express = require("express");
const router = express.Router();
const UserToken = require("../models/UserToken");

router.get("/", async (req, res) => {
  try {
    const users = await UserToken.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UserToken.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
