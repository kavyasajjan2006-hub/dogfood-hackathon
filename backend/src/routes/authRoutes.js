
const express = require("express");

const {
    register,
    login,
    changePassword
} = require("../controllers/authcontroller");

const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.put(
    "/change-password",
    authenticate,
    changePassword
);

module.exports = router;
