const jwt = require('jsonwebtoken');
const JWT_SECRET = "himanshi";

module.exports = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ msg: "Authorization header missing or malformed" });
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                console.log(allowedRoles);
                console.log(decoded.role);
                return res.status(403).json({ msg: "Access denied: insufficient permissions" });
            }
            next(); 
        } catch (err) {
            console.error("Authentication error:", err);
            res.status(401).json({ msg: "Invalid or expired token" });
        }
    };
};
