import "../styles/models.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faUser,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";

export default function ModalLogin({ isOpen, onClose, onCadastrarClick }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(true);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCadastroClick = (e) => {
    e.preventDefault();
    onCadastrarClick();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-login"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          {" "}
          <FontAwesomeIcon icon={faPaw} />
          <span>Pet Connect</span>
        </h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="field">
              <label>Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className="yellow-input"
                  required
                />
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              </div>
            </div>

            <div className="field">
              <label>Senha</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="yellow-input"
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="input-icon password-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
            <a href="#" className="forgot-password-link">
              Esqueci a senha
            </a>

            {showError && (
              <p className="error-message">Usuário ou senha incorreto!</p>
            )}
          </div>

          <button type="submit" className="btn-primary login-btn-yellow">
            <FontAwesomeIcon icon={faUser} className="btn-icon" />
            Entrar
          </button>

          <p className="modal-link">
            Não tem conta?{" "}
            <a href="#" onClick={handleCadastroClick} className="cadastro-link">
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
