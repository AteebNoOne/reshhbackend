const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 3, 
    message: "Too many requests for today, try again tomorrow"
});

async function validateIP(req, res, next) {
    try {
        await limiter(req, res, next); 
    } catch (err) {
        console.error("Rate limiting error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    validateIP
};
