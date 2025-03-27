import validator from 'validator';
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const registerUser = async(req, res) => {
    try{
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: 'Invalid email address'});
        }
        if(password.length < 8){
            return res.status(400).json({message: 'Password must be at least 8 characters'});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userData = {
            name, 
            email, 
            password: passwordHash
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.json({success: true, token})

    } catch(error) {
        console.log(error);
        res.json.status(500).json({message: 'Internal Server Error'})
    }
}

const loginUser = async(req, res) => {
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({success: true, token})

    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}

export {registerUser, loginUser}