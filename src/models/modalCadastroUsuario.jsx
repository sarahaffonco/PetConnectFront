import { useEffect, useState } from "react";
import "../styles/models.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ModalCadastroUsuario({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validar senhas
    if (formData.senha !== formData.confirmarSenha) {
      setMessage("❌ As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setMessage("❌ A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Enviando dados para registro:", formData);

      const response = await axios.post(
        `${API_URL}/adotantes`,
        {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          endereco: formData.endereco,
          senha: formData.senha,
        }
      );

      console.log("✅ Resposta do servidor:", response.data);

      if (response.status === 201) {
        setMessage("✅ Cadastro realizado com sucesso!");

        // Salvar token no localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

        // Limpar formulário
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          endereco: "",
          senha: "",
          confirmarSenha: "",
        });

        // Fechar modal após 2 segundos
        setTimeout(() => {
          onClose();
          setMessage("");
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("💥 Erro completo no cadastro:", error);
      console.error("📋 Detalhes do erro:", error.response?.data);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "❌ Erro ao cadastrar usuário. Tente novamente.";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-cadastro-usuario"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Crie sua Conta</h2>

        {message && (
          <div
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="purple-input"
              required
            />
          </div>

          <div className="field">
            <label>Telefone *</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="purple-input"
              required
            />
          </div>

          <div className="field">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="purple-input"
              required
            />
          </div>

          <div className="field">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Digite seu endereço completo"
              className="purple-input"
            />
          </div>

          <div className="field">
            <label>Senha *</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="purple-input"
              required
              minLength="6"
            />
          </div>

          <div className="field">
            <label>Confirmar Senha *</label>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              className="purple-input"
              required
            />
          </div>

          <button type="submit" className="btn-purple" disabled={loading}>
            <FontAwesomeIcon icon={faUserPlus} />
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
