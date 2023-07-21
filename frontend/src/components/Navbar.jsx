import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

function Navbar() {
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Tracker</h1>
        </Link>
        <nav>
          <div>
            <button onClick={handleClick}>Log out</button>
          </div>
          <div>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
