import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contextes/AuthContext';
import '../../Styles/Layout/NavBar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    closeAll();
  };

  return (
    <nav className="navbar">
      <div className="container navbarContainer">
        <div className="spacer"></div>

        <div className="mobileMenuToggle" onClick={toggleMenu}>
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </div>

        <ul className={`navLinks ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeAll}>Accueil</Link></li>
          <li>
            <Link to="/runs" onClick={closeAll}>
              <i className="fa-solid fa-running"></i> Courses
            </Link>
          </li>
          
          {currentUser ? (
            <>
              <li><Link to="/runs/create" onClick={closeAll}>Créer</Link></li>
              
              {/* Menu déroulant profil */}
              <li className="profileDropdown">
                <div className="profileTrigger" onClick={toggleProfileDropdown}>
                  <img 
                    src={currentUser.profile_picture 
                      ? `http://localhost:3000${currentUser.profile_picture}` 
                      : '/images/default-avatar.png'
                    }
                    alt={currentUser.username}
                    className="profilePic"
                  />
                  <span>{currentUser.username}</span>
                  <i className={`fa-solid fa-chevron-down ${profileDropdownOpen ? 'rotated' : ''}`}></i>
                </div>
                
                <div className={`dropdownMenu ${profileDropdownOpen ? 'active' : ''}`}>
                  <Link to="/profile" onClick={closeAll}>
                    <i className="fa-solid fa-user"></i>
                    Mon Profil
                  </Link>
                  
                  {currentUser.role === 'admin' && (
                    <Link to="/admin" onClick={closeAll} className="adminLink">
                      <i className="fa-solid fa-shield-alt"></i>
                      Administration
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="dropdownLogoutBtn">
                    <i className="fa-solid fa-sign-out-alt"></i>
                    Déconnexion
                  </button>
                </div>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth" className="authBtn" onClick={closeAll}>
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