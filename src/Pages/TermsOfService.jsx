import '../Styles/Pages/LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legalPage">
      <div className="container">
        <h1>Conditions d'Utilisation</h1>
        <div className="legalContent">
          
          <section>
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales d'utilisation ont pour objet de définir 
              les modalités et conditions d'utilisation de la plateforme RunShare, 
              ainsi que les droits et obligations des utilisateurs.
            </p>
          </section>

          <section>
            <h2>2. Inscription et compte utilisateur</h2>
            <p>
              L'inscription sur RunShare est gratuite et ouverte à toute personne physique 
              majeure. Vous vous engagez à fournir des informations exactes et à maintenir 
              votre profil à jour.
            </p>
            <ul>
              <li>Un seul compte par personne est autorisé</li>
              <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
              <li>Toute activité effectuée depuis votre compte est sous votre responsabilité</li>
            </ul>
          </section>

          <section>
            <h2>3. Utilisation du service</h2>
            <p>RunShare vous permet de :</p>
            <ul>
              <li>Créer et organiser des courses</li>
              <li>Participer aux courses d'autres utilisateurs</li>
              <li>Évaluer les courses et les participants</li>
              <li>Communiquer avec la communauté</li>
            </ul>
          </section>

          <section>
            <h2>4. Obligations des utilisateurs</h2>
            <p>En utilisant RunShare, vous vous engagez à :</p>
            <ul>
              <li>Respecter les autres utilisateurs</li>
              <li>Ne pas publier de contenu offensant, illégal ou inapproprié</li>
              <li>Honorer vos participations aux courses</li>
              <li>Signaler tout comportement abusif</li>
              <li>Respecter les règles de sécurité lors des courses</li>
            </ul>
          </section>

          <section>
            <h2>5. Responsabilité</h2>
            <p>
              <strong>Courses et activités :</strong> RunShare est une plateforme de mise en relation. 
              Nous ne sommes pas responsables des accidents, blessures ou dommages 
              survenant pendant les courses organisées via notre plateforme.
            </p>
            <p>
              <strong>Contenu utilisateur :</strong> Chaque utilisateur est responsable du contenu 
              qu'il publie et des informations qu'il communique.
            </p>
          </section>

          <section>
            <h2>6. Sanctions</h2>
            <p>
              En cas de non-respect des présentes conditions, RunShare se réserve le droit de :
            </p>
            <ul>
              <li>Avertir l'utilisateur</li>
              <li>Suspendre temporairement le compte</li>
              <li>Supprimer définitivement le compte</li>
              <li>Supprimer du contenu inapproprié</li>
            </ul>
          </section>

          <section>
            <h2>7. Modification des conditions</h2>
            <p>
              RunShare se réserve le droit de modifier les présentes conditions d'utilisation 
              à tout moment. Les utilisateurs seront informés des modifications par email 
              et/ou notification sur la plateforme.
            </p>
          </section>

          <section>
            <h2>8. Résiliation</h2>
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis votre profil. 
              RunShare peut également résilier votre accès en cas de violation des présentes conditions.
            </p>
          </section>

          <p className="lastUpdate">Dernière mise à jour : 4 juin 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;