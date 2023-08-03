const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// reset password
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = createToken(user._id);

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.PASSWORD_RESET_URL}/${resetToken}`;

    // Send password reset email using SendGrid
    const msg = {
      to: email,
      from: 'tomemetcalf@gmail.com',
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
    };

    await sgMail.send(msg);

    res.status(200).json({
      message:
        'Password reset token generated. Check your email for instructions.',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// password reset
const passwordReset = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    console.log('Password reset successful:', user.email);

    res.status(200).json({
      message:
        'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Error while resetting password:', error.message);
    res
      .status(500)
      .json({ error: 'An error occurred while resetting the password.' });
  }
};

module.exports = { signupUser, loginUser, resetPassword, passwordReset };
