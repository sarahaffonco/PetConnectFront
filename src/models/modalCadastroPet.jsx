import { useEffect } from "react";
import "../styles/models.css";

export default function ModalCadastroPet({ isOpen, onClose }) {
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
        className="modal-container modal-cadastro-pet"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Cadastro de Pet</h2>

        <form className="modal-form">
          <div className="field">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome do animalzinho"
              className="blue-input"
            />
          </div>

          <div className="field">
            <label>Espécie</label>
            <select className="blue-input">
              <option value="">Gato / Cachorro</option>
              <option value="gato">Gato</option>
              <option value="cachorro">Cachorro</option>
            </select>
          </div>

          <div className="field">
            <label>Nascimento</label>
            <input
              type="date"
              placeholder="Data de nascimento do Pet"
              className="blue-input"
            />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea
              placeholder="Descreva seu Pet - temperamento / fofuras"
              className="blue-input"
              rows="3"
            ></textarea>
          </div>

          <div className="field">
            <label>Tamanho</label>
            <select className="blue-input">
              <option value="">Pequeno / Médio / Grande</option>
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div className="field">
            <label>Personalidade</label>
            <select className="blue-input">
              <option value="">Brincalhão / Calmo</option>
              <option value="brincalhao">Brincalhão</option>
              <option value="calmo">Calmo</option>
            </select>
          </div>

          <button type="submit" className="btn-blue">
            🐾 Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
