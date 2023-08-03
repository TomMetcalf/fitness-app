const express = require('express')

// controller functions
const {
  signupUser,
  loginUser,
  resetPassword,
  passwordReset,
} = require('../controllers/userController');

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser);

// Password reset route
router.post('/reset-password', resetPassword);

// Reset password route
router.post('/password-reset', passwordReset);

module.exports = router