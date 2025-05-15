import jwt from 'jsonwebtoken';

export const userAuth = (req, res, next) => {
    try {
        // Try to get the token from either cookies or Authorization header
        const user_token = req.cookies.user_token || req.header('Authorization')?.split(' ')[1];

        if (!user_token) {
            return res.status(401).json({ message: 'No token provided, user not authorized', success: false });
        }

        // Verify the token
        const decoded = jwt.verify(user_token, process.env.JWT_SECRET_KEY);

        // Attach user data from token to the request
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();

    } catch (error) {
        console.log("Error in authentication middleware:", error);
        // Handle different types of errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token', success: false });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', success: false });
        }
        return res.status(401).json({ message: 'Authentication failed', success: false });
    }
};
