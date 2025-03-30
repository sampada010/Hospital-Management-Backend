import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader); // Debugging

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: 'No or Invalid Token Provided' });
        }

        const token = authHeader.split(" ")[1]; // Extract the actual token
        console.log("Extracted Token:", token); // Debugging

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ message: 'Invalid Token' });
    }
};

export default authUser;
