import '../Styles/Pages/HomePage.css';
import logo from '../assets/logo.png';

const HomePage = () => {
  return (
    <div className="homePage">
      {/* Logo flottant superposé au premier plan */}
      <div className="floatingLogo">
        <img src={logo} alt="RunShare Logo" />
      </div>
      
      <div className="hero">
        <div className="overlay"></div>
        <div className="heroContent">
          <h1>Trouvez des partenaires de course à pied</h1>
          <p>Rejoignez la communauté RunShare et partagez votre passion pour la course à pied</p>
          <div className="heroCta">
            <a href="/auth" className="btn">S'inscrire gratuitement</a>
            <a href="/runs" className="btn btn-outline">Découvrir les courses</a>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="container">
          <div className="sectionTitle">
            <h2>Comment ça marche</h2>
            <p className="subtitle">Rejoindre une communauté de coureurs n'a jamais été aussi simple</p>
          </div>
          
          <div className="featuresGrid">
            <div className="featureCard">
              <div className="iconWrapper">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h3>Créez votre profil</h3>
              <p>Inscrivez-vous et indiquez votre niveau et vos préférences de course</p>
            </div>
            
            <div className="featureCard">
              <div className="iconWrapper">
                <i className="fa-solid fa-magnifying-glass-location"></i>
              </div>
              <h3>Trouvez des courses</h3>
              <p>Découvrez les événements organisés près de chez vous</p>
            </div>
            
            <div className="featureCard">
              <div className="iconWrapper">
                <i className="fa-solid fa-people-group"></i>
              </div>
              <h3>Rejoignez un groupe</h3>
              <p>Participez à des sorties ou créez votre propre événement</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <div className="sectionTitle">
            <h2>Pourquoi courir avec RunShare ?</h2>
            <p className="subtitle">Des avantages uniques pour tous les coureurs</p>
          </div>
          
          <div className="featuresGrid">
            <div className="featureCard">
              <div className="iconWrapper">
                <i className="fa-solid fa-shield-heart"></i>
              </div>
              <h3>Sécurité</h3>
              <p>Courez en groupe pour plus de sécurité, surtout le soir</p>
            </div>
            
            <div className="featureCard">
              <div className="iconWrapper">
                <i className="fa-solid fa-medal"></i>
              </div>
              <h3>Motivation</h3>
              <p>Restez motivé en vous engageant avec d'autres coureurs</p>
            </div>
            
            <div className="featureCard">
              <div className="iconWrapper">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3>Communauté</h3>
              <p>Partagez votre passion et faites de nouvelles rencontres</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;