import DoctorModel from "../models/doctorModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const addDoctor = async (req, res) => {
    try {
        console.log("🔹 Received File:", req.file);
        console.log("🔹 Received JSON:", req.body);

        // Ensure 'available' is extracted correctly
        const { name, email, password, degree, experience, about, fee, address, speciality } = req.body;
        let { available } = req.body; // Extract available separately

        // Convert 'available' to boolean
        available = available === "true" || available === true; 

        if (!name || !email || !password || !degree || !experience || !about || !fee || !address || !speciality || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({message: 'Invalid email address'});
        }
        if(password.length < 8){
            return res.status(400).json({message: 'Password must be at least 8 characters'});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newDoctor = new DoctorModel({
            name,
            email,
            password: passwordHash,
            degree,
            experience,
            about,
            fee: Number(fee),
            address: JSON.parse(address), // Ensure address is a valid object
            speciality,
            available,  // Fixed 'available' variable usage
            image: req.file.path 
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginAdmin = async(req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({message: 'Login successful', token});
        } else {
            return res.status(400).json({message: 'Invalid credentials'});
        }

    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}