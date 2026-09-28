const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Location of our SQLite database
const dbPath = path.join(__dirname, "../../data/dogfood.db");

// Create or open the database
const db = new Database(dbPath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

// Read the database schema
const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

// Create the tables defined in schema.sql
db.exec(schema);

console.log("SQLite database connected");
console.log("Database schema loaded");

module.exports = db;