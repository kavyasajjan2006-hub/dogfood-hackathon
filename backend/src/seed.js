const bcrypt = require("bcryptjs");
const db = require("./config/database");

const users = [
    {
        name: "Admin User",
        email: "admin@dogfood.local",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Judge User",
        email: "judge@dogfood.local",
        password: "judge123",
        role: "judge"
    },
    {
        name: "Second Judge",
        email: "judge2@dogfood.local",
        password: "judge2123",
        role: "judge"
    }
];

for (const user of users) {
    const existing = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(user.email);

    if (existing) {
        console.log(`${user.role} already exists: ${user.email}`);
        continue;
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10);

    db.prepare(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `).run(
        user.name,
        user.email,
        hashedPassword,
        user.role
    );

    console.log(`Created ${user.role}: ${user.email}`);
}

console.log("Seed complete");