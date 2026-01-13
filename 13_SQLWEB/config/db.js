// config/db.js - SQLite database setup and initialization
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define the path to the SQLite database file
const dbPath = path.join(__dirname, "..", "db.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
});

module.exports = db;
//      isAdmin INTEGER NOT NULL DEFAULT 0
