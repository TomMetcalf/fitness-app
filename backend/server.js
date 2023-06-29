require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');
const cors = require('cors');

// express app
const app = express();

app.use(
  cors({
    origin: 'https://fitness-app-backend-pb8f.onrender.com',
  })
);

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/workouts', workoutRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('Connected to db and listening on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
