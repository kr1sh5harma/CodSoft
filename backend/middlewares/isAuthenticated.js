import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        // Fallback to Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                message: 'User unauthorized: No token provided',
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.id = decoded.userId;

        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        return res.status(401).json({
            message: 'Invalid or expired token',
            success: false
        });
    }
};

export default isAuthenticated;
