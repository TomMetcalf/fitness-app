import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const { resetPassword, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <form className="password-reset" onSubmit={handleSubmit}>
      <h3>Password Reset</h3>
      <label className="form-label">Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <button disabled={isLoading}>Reset Password</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PasswordReset;
