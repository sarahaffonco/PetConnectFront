import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "../styles/models.css";

export default function ModalAdocao({
  isOpen,
  onClose,
  pet,
  onAdocaoSucesso,
  onLoginClick,
}) {
  const { usuario, estaLogado } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [dadosAdocao, setDadosAdocao] = useState({
    observacoes: "",
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
    setDadosAdocao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!estaLogado()) {
      setMensagem("❌ Você precisa estar logado para adotar um pet");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const response = await axios.post(
        "https://petconnect-h8cb.onrender.com/api/adocoes",
        {
          petId: pet.id,
          adotanteId: usuario.id,
          observacoes: dadosAdocao.observacoes,
        }
      );

      if (response.status === 201) {
        setMensagem("✅ Adoção realizada com sucesso!");

        setTimeout(() => {
          onClose();
          onAdocaoSucesso();
          setMensagem("");
          setDadosAdocao({ observacoes: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao realizar adoção:", error);
      if (error.response?.status === 400) {
        setMensagem(`❌ ${error.response.data.erro}`);
      } else {
        setMensagem("❌ Erro ao realizar adoção. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleFazerLogin = () => {
    onClose();
    if (onLoginClick) {
      onLoginClick();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-adocao"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title">Adotar {pet?.nome}</h2>
          <p className="modal-subtitle">
            Preencha os dados para finalizar a adoção
          </p>
        </div>

        {mensagem && (
          <div
            className={`mensagem ${mensagem.includes("✅") ? "sucesso" : "erro"}`}
          >
            {mensagem}
          </div>
        )}

        {estaLogado() ? (
          <>
            <div className="adocao-info">
              <div className="pet-info-card">
                <h4>Informações do Pet</h4>
                <p>
                  <strong>Nome:</strong> {pet?.nome}
                </p>
                <p>
                  <strong>Espécie:</strong> {pet?.especie}
                </p>
                <p>
                  <strong>Personalidade:</strong>{" "}
                  {pet?.personalidade === "brincalhao" ? "Brincalhão" : "Calmo"}
                </p>
                <p>
                  <strong>Tamanho:</strong> {pet?.tamanho}
                </p>
              </div>

              <div className="adotante-info-card">
                <h4>Seus Dados</h4>
                <p>
                  <strong>Nome:</strong> {usuario?.nome}
                </p>
                <p>
                  <strong>Email:</strong> {usuario?.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {usuario?.telefone}
                </p>
                <p>
                  <strong>Endereço:</strong>{" "}
                  {usuario?.endereco || "Não informado"}
                </p>
              </div>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="campo">
                <label>Observações (opcional)</label>
                <textarea
                  name="observacoes"
                  value={dadosAdocao.observacoes}
                  onChange={handleChange}
                  placeholder="Alguma informação adicional sobre a adoção..."
                  className="blue-input"
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={onClose}
                  disabled={carregando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-confirmar"
                  disabled={carregando}
                >
                  {carregando ? "Processando..." : "Confirmar Adoção 🐾"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="aviso-login">
            <div className="aviso-content">
              <h3>💡 Login Necessário</h3>
              <p>
                Para adotar {pet?.nome}, você precisa estar logado na sua conta.
              </p>
              <button className="btn-login" onClick={handleFazerLogin}>
                Fazer Login
              </button>
              <button className="btn-cancelar" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
