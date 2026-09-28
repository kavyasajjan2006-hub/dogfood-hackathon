const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "dogfood-development-secret";

// REGISTER
function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

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

        const existingUser = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(email.toLowerCase().trim());

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Only allow participant during public registration.
        // Judge/admin accounts should be created by an admin later.
        const userRole = role === "participant" ? "participant" : "participant";

        const hashedPassword = bcrypt.hashSync(password, 10);

        const result = db
            .prepare(`
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `)
            .run(
                name.trim(),
                email.toLowerCase().trim(),
                hashedPassword,
                userRole
            );

        const user = {
            id: result.lastInsertRowid,
            name: name.trim(),
            email: email.toLowerCase().trim(),
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


module.exports = {
    register,
    login
};