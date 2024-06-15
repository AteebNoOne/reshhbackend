const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../contact/contact.db');
const reshhSecret = require('../_helpers/token');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user exists in database
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Password is correct, generate JWT token
            const accessToken = jwt.sign(
                { userId: user.id, email: user.email },
                reshhSecret,
                { expiresIn: '15s' } 
            );

            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error.' });
    }
});

// Update password route
router.post('/update', async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ message: 'UserId and newPassword are required.' });
    }

    try {
        // Update password using db.User.updatePassword method
        const result = await User.updatePassword(userId, newPassword);
        res.json(result);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error updating password.' });
    }
});

module.exports = router;
