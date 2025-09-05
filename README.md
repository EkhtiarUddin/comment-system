Comment System - MERN Stack with PostgreSQL
Full Stack Comment System build with React.js, Express.js, Node.js, PostgreSQL. Features user authentication, comment CRUD operations, likes/dislikes, nested replies, sorting, and pagination.

Features
User Authentication - JWT-based login/register system

Comment System - Create, read, update, delete comments

Reactions - Like and dislike comments with validation

Nested Replies - Threaded comment replies

Sorting - Sort by newest, most liked, most disliked

Pagination - Efficient comment loading

Real-time Updates - WebSocket support

Responsive Design - Works on all devices

SCSS Styling - Modern CSS with variables and mixins

Tech Stack
Frontend
React.js 18

React Router

Axios for API calls

SCSS for styling

Context API for state management

Backend
Node.js

Express.js

PostgreSQL with Prisma ORM

JWT authentication

WebSocket for real-time updates

bcryptjs for password hashing

Prerequisites
Before Starting, ensure you have installed:

Node.js (v18 or higher)

PostgreSQL

Git

Installation & Setup

1. Clone the Repository

git clone <https://github.com/EkhtiarUddin/comment-system.git>
cd comment-system
2. Backend Setup

## Navigate to backend directory
cd backend

# Install dependencies
npm install or yarn install

# Set up environment variables
cp .env.example .env
Edit the .env file with your database credentials:

.env
DATABASE_URL="postgresql://username:password@localhost:5432/comment_system"
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_random"
PORT=5000

How to generate a JWT Secret:
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -base64 64

3. Database Setup

# Create PostgreSQL database (via psql or pgAdmin)
createdb comment_system

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database with sample data
npm run seed

4. Frontend Setup

# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install or yarn install

# Set up environment variables
cp .env.example .env
Edit the .env file:

.env
REACT_APP_API_URL=http://localhost:5000/api

Running the Application

Development Mode

Terminal 1 - Backend:
cd backend
npm run dev
Backend will run on http://localhost:5000

Terminal 2 - Frontend:
cd frontend
npm start
Frontend will run on http://localhost:3000

Production Mode

Build the frontend:
cd frontend
npm run build

Start production server:
cd backend
npm start