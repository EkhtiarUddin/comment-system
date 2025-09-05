# Comment System – MERN Stack with PostgreSQL

A full-stack comment system built with **React.js, Express.js, Node.js, and PostgreSQL**.  
Features include **user authentication, comment CRUD operations, reactions (likes/dislikes), nested replies, sorting, pagination, and real-time updates**.

---

## Features

- **User Authentication** – JWT-based login/register system  
- **Comment System** – Create, read, update, delete comments  
- **Reactions** – Like and dislike comments with validation  
- **Nested Replies** – Threaded comment replies  
- **Sorting** – Sort by newest, most liked, most disliked  
- **Pagination** – Efficient comment loading  
- **Real-time Updates** – WebSocket support  
- **Responsive Design** – Works on all devices  
- **SCSS Styling** – Modern CSS with variables and mixins 

## Tech Stack

### Frontend
- React.js 18  
- React Router  
- Axios (API calls)  
- SCSS (styling)  
- Context API (state management)  

### Backend
- Node.js  
- Express.js  
- PostgreSQL with Prisma ORM  
- JWT authentication  
- WebSocket (real-time updates)  
- bcryptjs (password hashing)  

---
## Prerequisites

- Node.js (v18 or higher)  
- PostgreSQL  
- Git  

---

# Installation & Setup

### Clone the Repository

git clone <https://github.com/EkhtiarUddin/comment-system.git>
cd comment-system
## Backend Setup

1. Navigate to backend directory
cd backend

2. Install dependencies
npm install or yarn install

4. Set up environment variables
cp .env.example .env (rename .env.example to .env)

5. Update .env

5. .env file
DATABASE_URL="postgresql://username:password@localhost:5432/comment_system"
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_random"
PORT=5000

6. Generate a JWT Secret:
Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Using OpenSSL
openssl rand -base64 64

## Database Setup

1. Create PostgreSQL database (via psql or pgAdmin)
createdb comment_system (use pgadmin)

2. Generate Prisma client
npx prisma generate or yarn prisma generate

3. Run database migrations
npx prisma db push or yarn prisma db push

4. Seed the database with sample data
npm run seed

## Frontend Setup

1. Navigate to frontend directory
cd ../frontend

2. Install dependencies
npm install or yarn install

3. Set up environment variables
cp .env.example .env

5. update the .env file:
.env
REACT_APP_API_URL=http://localhost:5000/api

## Running the Application

### Development Mode

- **Terminal 1 - Backend:**
cd backend
npm run dev
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
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