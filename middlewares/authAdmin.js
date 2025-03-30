import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract the token correctly
        const token = authHeader.split(" ")[1]; 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.admin = decoded;
        next(); // Move to the next middleware

    } catch (error) {
        console.error("Auth Admin Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default authAdmin;
