const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return res.status(401).json({ error: "Access denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "admin") 
            return res.status(403).json({ error: "Access forbidden: Admins only" });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyAdmin;
