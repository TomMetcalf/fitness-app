import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <>
      <form className="login" onSubmit={handleSubmit}>
        <h3>Log In</h3>
        <label className="form-label">Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label className="form-label">Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button disabled={isLoading}>Log In</button>
        {error && <div className="error">{error}</div>}
      </form>
      <Link className="password" to="/reset-password">Forgot your password?</Link>
      <div className="base"></div>
    </>
  );
};

export default Login;
