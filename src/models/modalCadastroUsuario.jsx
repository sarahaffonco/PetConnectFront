import { useEffect } from "react";
import "../styles/modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function ModalCadastroUsuario({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-cadastro-usuario"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Cadastro de Usuário</h2>

        <form className="modal-form">
          <div className="field">
            <label>Nome</label>
            <input type="text" placeholder="Digite seu nome completo" className="purple-input" />
          </div>

          <div className="field">
            <label>Telefone</label>
            <input type="tel" placeholder="Telefone com DDD (xx) 9999-9999" className="purple-input" />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="Digite seu email" className="purple-input" />
          </div>

          <div className="field">
            <label>Endereço</label>
            <input type="text" placeholder="Digite seu endereço completo" className="purple-input" />
          </div>

          <div className="field">
            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha" className="purple-input" />
          </div>

          <button type="submit" className="btn-purple"><FontAwesomeIcon icon={faUserPlus} />Cadastrar</button>
        </form>
      </div>
    </div>
  );
}
