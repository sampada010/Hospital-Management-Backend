import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true }, // Ensure this is set from doctor’s fee
    date: { type: Date, default: Date.now }, // Auto-set date to current timestamp
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
});

// Ensure we don't redefine the model if it already exists
const appointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;
