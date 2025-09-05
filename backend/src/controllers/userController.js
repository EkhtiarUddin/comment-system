const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const UserController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
    
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword
        }
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }
};

module.exports = UserController;
