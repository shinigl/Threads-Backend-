
# Threads Clone - Backend

## Overview
This is the backend of a Threads clone, handling user authentication, post management, and interactions.

## Features
- User authentication (JWT-based login)
- CRUD operations for posts
- Like and comment system
- User follow/unfollow functionality

## Tech Stack
- **Backend Framework:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Storage:** Cloudinary (for images)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/threads-clone-backend.git
   cd threads-clone-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | /auth/register   | Register a new user |
| POST   | /auth/login      | Login user and return JWT |
| POST   | /posts/          | Create a new post |
| GET    | /posts/          | Get all posts |
| DELETE | /posts/:id       | Delete a post |
| POST   | /posts/:id/like  | Like a post |
| POST   | /posts/:id/comment | Comment on a post |
| POST   | /users/follow/:id | Follow a user|
