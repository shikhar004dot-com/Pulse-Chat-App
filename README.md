# 💬 Pulse Chat App

A real-time group chat application built using Node.js, Express, Socket.IO, MongoDB Atlas, JWT Authentication, and bcrypt.

## 🚀 Live Demo

https://pulse-chat-app-z8jy.onrender.com/

## Features

* User Registration & Login
* JWT Authentication
* Real-time Messaging with Socket.IO
* Online Members List
* Typing Indicator
* Message Seen Count
* Dark Mode
* Responsive UI
* MongoDB Atlas Integration
* Password Hashing using bcrypt
* Mobile-Friendly Interface

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcrypt.js

### Deployment

* Render

## Project Structure

```text
Pulse-Chat-App/
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── Message.js
│   └── User.js
│
├── public/
│   ├── script.js
│   ├── style.css
│   ├── sounds/
│   └── index.html
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Installation

### Clone Repository

```bash
git clone https://github.com/shikhar004dot-com/Pulse-Chat-App.git
cd Pulse-Chat-App
```

### Install Dependencies

```bash
npm install
```

### Create .env File

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

### Run Application

```bash
node server.js
```

or

```bash
nodemon server.js
```

### Open Browser

```text
http://localhost:3000
```

## Screenshots

### Authentication Page

<img width="1918" height="966" alt="Authentication Page" src="https://github.com/user-attachments/assets/7e0edd71-c26d-45ec-8b12-07bf2c983b54" />

### Registration Success

<img width="1918" height="970" alt="Registration Success" src="https://github.com/user-attachments/assets/a94255a4-e645-4421-bca2-92164d1fe0ba" />

### Chat Interface

<img width="1918" height="967" alt="Chat Interface" src="https://github.com/user-attachments/assets/110446f4-eab5-4949-8192-a94f41b1637e" />

### Dark Mode toggle

<img width="1918" height="967" alt="Dark Mode" src="https://github.com/user-attachments/assets/f9a07dc0-c9e4-4e42-887c-ec2a35b914a2" />

### Seen Status & Members List

<img width="1918" height="967" alt="Seen Status and Members List" src="https://github.com/user-attachments/assets/fb62846b-f656-4d9d-a0e0-fd007f182dbc" />

## Future Improvements

* Private Chats
* Chat Rooms
* File Sharing
* User Profile Pictures
* Message Deletion
* Message Editing
* End-to-End Encryption
* Push Notifications

## Author

**Shikhar Srivastava**

GitHub:
https://github.com/shikhar004dot-com
