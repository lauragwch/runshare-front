import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contextes/AuthContext';
import '../../Styles/Layout/NavBar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbarContainer">
        <div className="spacer"></div>

        <div className="mobileMenuToggle" onClick={toggleMenu}>
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </div>

        <ul className={`navLinks ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
          <li><Link to="/runs" onClick={() => setMenuOpen(false)}>Courses</Link></li>
          
          {currentUser ? (
            <>
              <li><Link to="/runs/create" onClick={() => setMenuOpen(false)}>Créer</Link></li>
              <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Mon Profil</Link></li>
              <li>
                <button className="logoutBtn" onClick={handleLogout}>
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth" className="authBtn" onClick={() => setMenuOpen(false)}>
                Connexion / Inscription
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;