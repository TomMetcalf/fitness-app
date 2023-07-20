import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Tracker</h1>
        </Link>
        <nav>
          <div>
            <Link to="/">Home</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
