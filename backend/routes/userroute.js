const express = require("express");
const { createUser } = require("../controller/usercontroller");
const router = express.Router();

// router.post("/create", createUser);

// module.exports = router;


const { authMiddleware } = require("../middlewares/middleware");
router.post("/create", authMiddleware, createUser);

module.exports = router;

