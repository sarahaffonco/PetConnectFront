import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/models.css";

export default function ModalCadastroPet({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    dataNascimento: "",
    descricao: "",
    tamanho: "",
    personalidade: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

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
    setCarregando(true);
    setMensagem("");

    try {
      const response = await axios.post(
        "https://petconnect-h8cb.onrender.com/api/pets",
        formData
      );

      if (response.status === 201) {
        setMensagem("✅ Pet cadastrado com sucesso!");
        setFormData({
          nome: "",
          especie: "",
          dataNascimento: "",
          descricao: "",
          tamanho: "",
          personalidade: "",
        });

        // Fechar modal após 2 segundos
        setTimeout(() => {
          onClose();
          setMensagem("");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      setMensagem("❌ Erro ao cadastrar pet. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

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

        {mensagem && (
          <div
            className={`mensagem ${mensagem.includes("✅") ? "sucesso" : "erro"}`}
          >
            {mensagem}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome do animalzinho"
              className="blue-input"
              required
            />
          </div>

          <div className="campo">
            <label>Espécie</label>
            <select
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              className="blue-input"
              required
            >
              <option value="">Selecione a espécie</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
            </select>
          </div>

          <div className="campo">
            <label>Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              placeholder="Data de nascimento do Pet"
              className="blue-input"
              required
            />
          </div>

          <div className="campo">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva seu Pet - temperamento / fofuras"
              className="blue-input"
              rows="3"
            ></textarea>
          </div>

          <div className="campo">
            <label>Tamanho</label>
            <select
              name="tamanho"
              value={formData.tamanho}
              onChange={handleChange}
              className="blue-input"
              required
            >
              <option value="">Selecione o tamanho</option>
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div className="campo">
            <label>Personalidade</label>
            <select
              name="personalidade"
              value={formData.personalidade}
              onChange={handleChange}
              className="blue-input"
              required
            >
              <option value="">Selecione a personalidade</option>
              <option value="brincalhao">Brincalhão</option>
              <option value="calmo">Calmo</option>
            </select>
          </div>

          <button type="submit" className="btn-blue" disabled={carregando}>
            {carregando ? "Cadastrando..." : "🐾 Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
