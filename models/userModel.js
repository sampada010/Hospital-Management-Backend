import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {type: String, default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAOXRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjQuMywgaHR0cHM6Ly9tYXRwbG90bGliLm9yZy/MnkTPAAAACXBIWXMAAB7CAAAewgFu0HU+AAEAAElEQVR4nOzdd3gU5f7H8e9"},
  address: { type: Object, default: {line1:'', line2:''} },
  gender: {type: String, default: "Not Selected"},
  dob: {type:String, default: "Not Selected"},
  phone: {type: String, default:'0000000000'}
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;