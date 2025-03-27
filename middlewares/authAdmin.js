import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, cb) => {
    try{
        const token = req.headers["authorization"];
        if(!token){
            return res.status(401).json({message: 'No token provided'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: 'Invalid token'});
        }

        req.admin = decoded;
        cb();
    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}

export default authAdmin;