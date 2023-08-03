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
      <p>
        Need to reset your Password? <br />
        <br /> Enter your email below to send a password reset to your
        registered account.
      </p>
      <label className="form-label password-label">Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="reset-email"
        placeholder='Enter email here...'
      />
      <button disabled={isLoading}>Send Password Reset</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PasswordReset;
