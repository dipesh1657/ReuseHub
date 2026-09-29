const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ msg: 'Please login first' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;
