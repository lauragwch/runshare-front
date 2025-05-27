import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contextes/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import '../../Styles/Auth/LoginForm.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const { loginUser, error } = useContext(AuthContext);
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

        if (!formData.email) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await loginUser({
                email: formData.email,
                password: formData.password
            });

            navigate('/'); // Redirection vers la page d'accueil après connexion

        } catch (err) {
            console.error('Erreur de connexion:', err);
        }
    };

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="loginForm">
            {error && <div className="errorMessage">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="email">Email</label>
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
                    <label htmlFor="password">Mot de passe</label>
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
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                            <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                        </button>
                    </div>
                    {errors.password && <div className="fieldError">{errors.password}</div>}
                </div>

                <div className="forgotPasswordLink">
                    <button
                        type="button"
                        className="linkButton"
                        onClick={toggleForgotPassword}
                    >
                        Mot de passe oublié ?
                    </button>
                </div>

                <button type="submit" className="submitBtn">
                    Se connecter
                </button>
            </form>

            {showForgotPassword && (
                <ForgotPasswordModal
                    onClose={toggleForgotPassword}
                />
            )}
        </div>
    );
};

export default LoginForm;