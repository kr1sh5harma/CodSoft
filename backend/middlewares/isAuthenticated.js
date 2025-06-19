import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User unauthorized',
                success: false
            })
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodeToken) {
            return res.status(401).json({
                message: 'invalid token',
                success: false
            })
        };
        req.id = decodeToken.userId;
        next();
    }
    catch (e) {
        console.log(e);
    }
}

export default isAuthenticated;