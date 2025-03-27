import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    speciality: String,
    degree: String,
    experience: String,
    about: String,
    available: { type: Boolean, default: false }, // Ensure 'available' is defined
    fee: Number,
    address: {
        line1: String,
        city: String
    },
    image: String
});

const DoctorModel = mongoose.model("Doctor", doctorSchema);
export default DoctorModel;
