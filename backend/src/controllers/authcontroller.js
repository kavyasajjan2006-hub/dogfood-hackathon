
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "dogfood-development-secret";

// REGISTER
function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Public registration only creates participant accounts.
        const userRole = "participant";
        const hashedPassword = bcrypt.hashSync(password, 10);

        const result = db
            .prepare(`
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `)
            .run(
                name.trim(),
                normalizedEmail,
                hashedPassword,
                userRole
            );

        const user = {
            id: result.lastInsertRowid,
            name: name.trim(),
            email: normalizedEmail,
            role: userRole
        };

        const token = jwt.sign(user, JWT_SECRET, {
            expiresIn: "7d"
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user,
            token
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
}


// LOGIN
function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = db
            .prepare(`
                SELECT id, name, email, password, role
                FROM users
                WHERE email = ?
            `)
            .get(email.toLowerCase().trim());

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatches = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(safeUser, JWT_SECRET, {
            expiresIn: "7d"
        });

        return res.json({
            success: true,
            message: "Login successful",
            user: safeUser,
            token
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
}


// CHANGE PASSWORD
function changePassword(req, res) {
    try {
        // Requires authentication middleware to set req.user.
        const userId = req.user && req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both passwords are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the current password"
            });
        }

        const user = db
            .prepare("SELECT id, password FROM users WHERE id = ?")
            .get(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const passwordMatches = bcrypt.compareSync(
            currentPassword,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        db.prepare("UPDATE users SET password = ? WHERE id = ?")
            .run(hashedPassword, userId);

        return res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while changing password"
        });
    }
}


module.exports = {
    register,
    login,
    changePassword
};