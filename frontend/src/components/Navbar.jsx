import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

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
          {user && (
            <div className="logout">
              <span className='user-email'>{user.email}</span>
              <button className='logout' onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div className="navbar-links">
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
