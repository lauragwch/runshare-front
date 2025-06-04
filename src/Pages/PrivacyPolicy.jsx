import '../Styles/Pages/LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legalPage">
      <div className="container">
        <h1>Politique de Confidentialité</h1>
        <div className="legalContent">
          
          <section>
            <h2>1. Collecte des données</h2>
            <p>
              RunShare collecte les données personnelles suivantes lors de votre inscription :
              nom d'utilisateur, adresse email, ville, niveau de course et photo de profil (optionnelle).
            </p>
          </section>

          <section>
            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Organiser et participer aux courses</li>
              <li>Communiquer avec les autres utilisateurs</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2>3. Partage des données</h2>
            <p>
              Nous ne vendons ni ne louons vos données personnelles à des tiers. 
              Vos informations de profil sont visibles par les autres utilisateurs de la plateforme
              selon vos paramètres de confidentialité.
            </p>
          </section>

          <section>
            <h2>4. Cookies</h2>
            <p>
              Notre site utilise des cookies techniques nécessaires au fonctionnement 
              (authentification, préférences utilisateur). Aucun cookie publicitaire n'est utilisé.
            </p>
          </section>

          <section>
            <h2>5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>Accès à vos données personnelles</li>
              <li>Rectification des données inexactes</li>
              <li>Suppression de votre compte et données</li>
              <li>Portabilité de vos données</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous à : privacy@runshare.com</p>
          </section>

          <section>
            <h2>6. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles 
              appropriées pour protéger vos données contre l'accès, la modification, 
              la divulgation ou la destruction non autorisés.
            </p>
          </section>

          <p className="lastUpdate">Dernière mise à jour : 4 juin 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;