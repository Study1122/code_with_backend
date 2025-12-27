# Code With Backend 🚀

A complete backend project built with **Node.js** and **Express.js**, following real-world backend development practices.  
This project focuses on authentication, secure APIs, file uploads, and clean architecture.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary
- dotenv
- cors
- cookie-parser

---

## 📁 Project Structure

code_with_backend/ │ ├── src/ │   ├── controllers/      # Business logic │   ├── models/           # Mongoose schemas │   ├── routes/           # API routes │   ├── middlewares/      # Auth, multer, error handling │   ├── utils/            # ApiError, ApiResponse, asyncHandler │   ├── db/               # Database connection │   ├── app.js            # Express app setup │   └── index.js          # Server entry point │ ├── public/ │   └── temp/             # Temporary uploaded files │ ├── .env ├── .gitignore ├── package.json └── README.md 

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=*

```
---

## 🔐 Authentication Features

- User registration
- User login
- Access and refresh token based authentication
- Secure cookies
- Logout from all active sessions
- Protected routes using JWT middleware

---

## 📤 File Upload Features

- Avatar upload
- Cover image upload
- File handling using Multer
- Cloud storage using Cloudinary
- Temporary file cleanup after upload

---

## 🧪 Error Handling

- Centralized error handling middleware
- Custom ApiError class
- Standard ApiResponse format
- Async error handling using asyncHandler

---

## 📮 API Testing

You can test APIs using:

- Postman
- Thunder Client
- curl

---

## 🚀 Future Improvements

- Role-based access control (RBAC)
- Pagination and filtering
- Rate limiting
- Swagger API documentation
- Unit and integration tests

---

## 🤝 Contributing

Contributions are welcome.

Fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Study Point  
Backend Developer
