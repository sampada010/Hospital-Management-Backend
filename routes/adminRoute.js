import express from "express";
import upload from "../middlewares/multer.js";
import { addDoctor, allDoctors, appointmentsAdmin, loginAdmin, allUsers } from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Upload image + JSON data
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);

adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/all-users", allUsers);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);

export default adminRouter;
