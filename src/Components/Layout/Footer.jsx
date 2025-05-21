import { Link } from 'react-router-dom';
import '../../Styles/Layout/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="content">
          <div className="section">
            <h3>RunShare</h3>
            <p>Trouvez des partenaires de course près de chez vous.</p>
          </div>
          
          <div className="section">
            <h3>Liens Rapides</h3>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/runs">Courses</Link></li>
              <li><Link to="/auth">Inscription / Connexion</Link></li>
            </ul>
          </div>
          
          <div className="section">
            <h3>Contact</h3>
            <p>contact@runshare.fr</p>
            <div className="socialLinks">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; {currentYear} RunShare - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;