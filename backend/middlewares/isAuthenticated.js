import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User unauthorized',
                success: false
            })
        }

        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodeToken) {
            return res.status(401).json({
                message: 'invalid token',
                success: false
            })
        };
        req.id = decode.userId;
        next();
    }
    catch (e) {
        console.log(e);
    }
}

export default isAuthenticated;