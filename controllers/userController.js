import validator from 'validator';
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import DoctorModel from '../models/DoctorModel.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import razorpay from 'razorpay';
import appointmentModel from '../models/appointmentModel.js';
import mongoose from 'mongoose';


const getAllDoctors = async (req, res) => {
    try {
        const doctors = await DoctorModel.find({}, '-password');
        res.status(200).json({success:true, doctors});
    } catch (error) {
        console.log(error);
        res.json.status(500).json({ message: 'Internal Server Error' })
    }
}


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered. Please log in.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json.status(500).json({ message: 'Internal Server Error' })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


const getProfile = async (req, res) => {
    try {
        console.log("User ID from request:", req.user?.id); // Debug log

        const user = await userModel.findById(req.user?.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, user });

    } catch (error) {
        console.error("Error in getProfile:", error); // Log actual error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file; // Image from request

        // Validate token/userId
        if (!userId) {
            return res.status(401).json({ message: "No or Invalid Token Provided" });
        }

        // Validate fields
        if (!name || !phone || !address || !dob || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Convert address from string to JSON
        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (error) {
            return res.status(400).json({ message: "Invalid address format" });
        }

        // Find and update user
        let updateData = { name, phone, address: parsedAddress, dob, gender };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            updateData.image = imageUpload.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime, amount, reason } = req.body;

        // Validate doctor ID
        if (!mongoose.Types.ObjectId.isValid(docId)) {
            return res.status(400).json({ message: "Invalid doctor ID format" });
        }

        // Fetch doctor data
        const doctor = await DoctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // amount = doctor.fee;

        // Fetch user data
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare user and doctor data
        const docData = {
            id: doctor._id,
            name: doctor.name,
            specialization: doctor.specialization,
        };

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        // Create appointment
        const newAppointment = new appointmentModel({
            userId,
            docId,
            slotDate,
            slotTime,
            amount,
            reason,
            userData,
            docData,
            date: Date.now(),
        });

        // Save to database
        await newAppointment.save();

        return res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        console.error("Error in bookAppointment:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments });

    } catch (error) {
        console.error("Error in listAppointment:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
}


const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        // Fetch appointment details
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Validate if the appointment belongs to the user
        if (appointmentData.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        // Mark appointment as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Free up the doctor's slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await DoctorModel.findById(docId);

        if (doctorData) {
            let slots_booked = doctorData.slotsBooked || {};
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(slot => slot !== slotTime);
            }
            await DoctorModel.findByIdAndUpdate(docId, { slotsBooked: slots_booked });
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });

    } catch (error) {
        console.error("Error in cancelAppointment:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});


const paymentRazorpay = async (req, res) => {

    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(400).json({ message: 'Invalid appointment or appointment cancelled' });
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.error("Error in paymentRazorpay:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status == 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
            res.json({ success: true, message: 'Payment Successfull' });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { getAllDoctors, registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay };

// export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };