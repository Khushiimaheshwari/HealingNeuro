const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 5501;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database
const db = new sqlite3.Database('./SQLite/DMS.db');

db.run(`
    CREATE TABLE IF NOT EXISTS User_Info (
        Username TEXT PRIMARY KEY,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL,
        Password TEXT NOT NULL,
        IsLoggedIn BOOLEAN NOT NULL DEFAULT FALSE,
        Week INTEGER NOT NULL DEFAULT 0,
        IsChosenExpert BOOLEAN NOT NULL DEFAULT 0,
        Expert_Selected TEXT 
    )
`);

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO User_Info (Username, Name, Email, Password, IsLoggedIn, Week) VALUES (?, ?, ?, ?, FALSE, 0)`,
            [username, name, email, hashedPassword],
            (err) => {
                if (err) {
                    console.error(err);
                    res.status(400).json({ error: 'User already exists or invalid data' });
                } else {
                    createUserTable(username);
                    res.status(201).json({ message: 'User registered successfully!' });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM User_Info WHERE Username = ?`, [username], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while logging in' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.Password);
        if (isValid) {
            db.run(`UPDATE User_Info SET IsLoggedIn = TRUE WHERE Username = ?`, [username], (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.status(500).json({ error: 'Failed to update login status' });
                }
                res.status(200).json({ message: 'Login successful!', username });
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    const { username } = req.body;

    db.get(`SELECT * FROM User_Info WHERE Username = ?`, [username], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred while logging out' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        db.run(`UPDATE User_Info SET IsLoggedIn = FALSE WHERE Username = ?`, [username], (updateErr) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ error: 'Failed to update logout status' });
            }
            res.status(200).json({ message: 'Logout successful!' });
        });
    });
});

// Create User Specific Table
function createUserTable(username) {
    const tableName = `info_${username}`;
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            Week INTEGER PRIMARY KEY,
            Session1_predicted_label TEXT,
            Session1_depression_score INTEGER,
            Session2_predicted_label TEXT,
            Session2_depression_score INTEGER,
            Session3_predicted_label TEXT,
            Session3_depression_score INTEGER,
            Final_predicted_label TEXT,
            Final_depression_score INTEGER
        );
    `;
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error(`Error creating table ${tableName}:`, err.message);
        } else {
            console.log(`Table ${tableName} created successfully.`);
        }
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
