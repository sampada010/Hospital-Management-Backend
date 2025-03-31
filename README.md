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
MONGO_URI=''

CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''

ADMIN_EMAIL=''
ADMIN_PASSWORD=''
JWT_SECRET=''

RAZORPAY_KEY_ID=''
RAZORPAY_SECRET_KEY=''
CURRENCY = INR

```

### 4️⃣ Run the Server
```sh
npm start
```
