import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../Components/Auth/LoginForm';
import RegisterForm from '../Components/Auth/RegisterForm';
import logo from '../assets/logo.png'; 
import '../Styles/Pages/AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setIsLogin(false);
    }
  }, [location]);

  return (
    <div className="authPage">
      <div className="authPageContent">
        
        <div className="authInfoSection">

          <div className="authLogoContainer">
            <img src={logo} alt="RunShare Logo" className="authLogo" />
          </div>
          
          <div className="authHeader">
            <h1>Rejoignez la communauté RunShare</h1>
            <p className="authSubtitle">
              {isLogin 
                ? "Connectez-vous pour retrouver votre communauté de coureurs" 
                : "Créez votre compte gratuitement et commencez à courir ensemble"}
            </p>
            
            <div className="authBenefits">
              <div className="benefitItem">
                <span className="benefitIcon"><i className="fa-solid fa-user-group"></i></span>
                <span className="benefitText">Trouvez des partenaires de course</span>
              </div>
              <div className="benefitItem">
                <span className="benefitIcon"><i className="fa-solid fa-route"></i></span>
                <span className="benefitText">Participez à des événements</span>
              </div>
              <div className="benefitItem">
                <span className="benefitIcon"><i className="fa-solid fa-shield-heart"></i></span>
                <span className="benefitText">Courez en toute sécurité</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section à droite avec le formulaire */}
        <div className="authFormSection">
          <div className="authContainer">
            <div className="formToggle">
              <button 
                className={isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(true)}
              >
                Connexion
              </button>
              <button 
                className={!isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(false)}
              >
                Inscription
              </button>
            </div>
            
            <div className="authFormContainer">
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;