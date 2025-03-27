# 🏥 Hospital Management Backend  

This is the backend for the **Hospital Management System**. It provides APIs for admin, doctors, and patients to manage appointments, profiles, and payments.  

---

## 🚀 Installation  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/sampada010/Hospital-Management-Backend.git
cd Hospital-Management-Backend
```

### 2️⃣ Install Dependenciesy
```sh
npm install express mongoose multer bcrypt cloudinary cors dotenv jsonwebtoken nodemon validator
```

### 3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin-email
ADMIN_PASSWORD=admin-pw
```

### 4️⃣ Run the Server
```sh
npm start
```
