import { useState } from "react";
import ModalCadastroPet from "../models/modalCadastroPet.jsx";

export default function AdocaoCaes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>🐶 Adoção de Cachorros</h2>
      <p>Veja nossos amigos peludos disponíveis para adoção!</p>

      {/* Botão para abrir a modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="blue-btn"
      >
        Cadastrar Pet
      </button>

      {/* Modal */}
      <ModalCadastroPet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
