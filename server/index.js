const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const savedRecipeRoutes = require('./routes/savedRecipes')
const suppliesRoutes = require('./routes/supplies')

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/savedrecipes', savedRecipeRoutes);
app.use('/api/supplies', suppliesRoutes);


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API Running'));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.setMaxListeners(50);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      setTimeout(() => {
        server.close();
        server.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      }, 1000); 
    } else {
      console.error('Server error:', error);
    }
  });
  
  const gracefulShutdown = () => {
    console.log('Received shutdown signal, shutting down gracefully...');
    server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
    });
  
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000); 
  };
  
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  