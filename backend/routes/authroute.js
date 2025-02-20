const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyAdmin = require("../middleware");
const router = express.Router();

router.post("/admin/add-user", verifyAdmin, async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, role });

        res.status(201).json({ message: "User added successfully", newUser });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
