import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const connectCloudinary = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("❌ Cloudinary ENV variables are missing!");
        process.exit(1);
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log(`✅ Cloudinary Connected: ${process.env.CLOUDINARY_CLOUD_NAME}`);
};

export default connectCloudinary;
