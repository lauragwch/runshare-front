import '../Styles/Pages/LegalPages.css';

const LegalNotice = () => {
  return (
    <div className="legalPage">
      <div className="container">
        <h1>Mentions Légales</h1>
        <div className="legalContent">
          
          <section>
            <h2>1. Éditeur du site</h2>
            <p>
              <strong>Nom :</strong> RunShare SAS<br/>
              <strong>Adresse :</strong> 123 Rue de la Course, 75001 Paris, France<br/>
              <strong>Téléphone :</strong> +33 1 23 45 67 89<br/>
              <strong>Email :</strong> contact@runshare.com<br/>
              <strong>SIRET :</strong> 123 456 789 00012<br/>
              <strong>TVA :</strong> FR12345678901
            </p>
          </section>

          <section>
            <h2>2. Directeur de la publication</h2>
            <p>
              <strong>Nom :</strong> Jean Dupont<br/>
              <strong>Qualité :</strong> Président de RunShare SAS
            </p>
          </section>

          <section>
            <h2>3. Hébergement</h2>
            <p>
              <strong>Hébergeur :</strong> OVH SAS<br/>
              <strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France<br/>
              <strong>Téléphone :</strong> 1007
            </p>
          </section>

          <section>
            <h2>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale 
              sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
              reproduction sont réservés, y compris pour les documents téléchargeables 
              et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2>5. Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont aussi précises que possible 
              et le site remis à jour à différentes périodes de l'année. Cependant, 
              des erreurs ou omissions peuvent survenir. L'internaute devra donc 
              s'assurer de l'exactitude des informations auprès de RunShare.
            </p>
          </section>

          <section>
            <h2>6. Liens hypertextes</h2>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site web 
              en direction d'autres ressources présentes sur le réseau Internet ne 
              sauraient engager la responsabilité de RunShare.
            </p>
          </section>

          <p className="lastUpdate">Dernière mise à jour : 4 juin 2025</p>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;