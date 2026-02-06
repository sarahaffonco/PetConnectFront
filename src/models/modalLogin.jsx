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
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ModalLogin({ isOpen, onClose, onCadastrarClick }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setShowError(false); // Limpar erro quando usuário digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowError(false);

    try {
      const response = await axios.post(
        `${API_URL}/adotantes/login`,
        {
          email: formData.email,
          senha: formData.senha,
        }
      );

      if (response.data.token) {
        // Salvar token e dados do usuário
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify(response.data.adotante));

        // Fechar modal e recarregar
        onClose();
        window.location.reload(); // Para atualizar estado de autenticação
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleCadastroClick = (e) => {
    e.preventDefault();
    onCadastrarClick();
  };

  if (!isOpen) return null;

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
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

          <button
            type="submit"
            className="btn-primary login-btn-yellow"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faUser} className="btn-icon" />
            {loading ? "Entrando..." : "Entrar"}
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
