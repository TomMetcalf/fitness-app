const express = require('express')

// controller functions
const {
  signupUser,
  loginUser,
  resetPassword,
} = require('../controllers/userController');

const router = express.Router()

// login route
router.post('/login', loginUser)


// signup route
router.post('/signup', signupUser);

// Password reset route
router.post('/reset-password', resetPassword);

module.exports = router