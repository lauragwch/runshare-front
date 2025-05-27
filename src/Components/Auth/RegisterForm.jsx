import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contextes/AuthContext';
import '../../Styles/Auth/RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    level: 'débutant',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerUser, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        level: formData.level,
        bio: formData.bio
      });

      navigate('/');

    } catch (err) {
      console.error('Erreur d\'inscription:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="registerForm">
      {error && <div className="errorMessage">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="username">Nom d'utilisateur*</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Votre nom d'utilisateur"
          />
          {errors.username && <div className="fieldError">{errors.username}</div>}
        </div>

        <div className="formGroup">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre email"
          />
          {errors.email && <div className="fieldError">{errors.email}</div>}
        </div>

        <div className="formGroup">
          <label htmlFor="password">Mot de passe*</label>
          <div className="passwordInputContainer">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              className="passwordToggleBtn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
            </button>
          </div>
          {errors.password && <div className="fieldError">{errors.password}</div>}
        </div>

        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirmer le mot de passe*</label>
          <div className="passwordInputContainer">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
            />
            <button
              type="button"
              className="passwordToggleBtn"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              <i className={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
            </button>
          </div>
          {errors.confirmPassword && <div className="fieldError">{errors.confirmPassword}</div>}
        </div>

        <div className="formGroup">
          <label htmlFor="city">Ville</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Votre ville"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="level">Niveau</label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="débutant">Débutant</option>
            <option value="intermédiaire">Intermédiaire</option>
            <option value="avancé">Avancé</option>
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="bio">Biographie</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Parlez-nous de vous et de votre expérience en course à pied"
            rows="4"
          />
        </div>

        <p className="requiredFields">* Champs obligatoires</p>

        <button type="submit" className="submitBtn">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;