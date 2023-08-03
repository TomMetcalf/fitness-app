import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch('/api/user/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, resetToken }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('An error occurred while resetting the password.');
    }
  };

  return (
    <form className="password-reset" onSubmit={handleResetPassword}>
      <h3>Reset Password</h3>
      <p>
        To reset your password, enter your new password in the box below and
        click reset password.
      </p>
      <label className="form-label password-label">Email:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password here..."
        className="reset-email"
      />
      <button>Reset Password</button>
      <p>{message}</p>
    </form>
  );
};

export default ResetPassword;
