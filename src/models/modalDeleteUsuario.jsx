import { useEffect } from "react";
import "../styles/models.css";

export default function ModalDeleteUsuario({
  isOpen,
  onClose,
  onConfirm,
  loading
}) {
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
        className="modal-container modal-danger"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="modal-title">⚠️ Excluir Minha Conta</h2>

        <div className="delete-warning">
          <p><strong>ATENÇÃO: Esta ação é irreversível!</strong></p>
          <p>Ao excluir sua conta:</p>
          <ul>
            <li>✅ Todos os seus dados pessoais serão removidos</li>
            <li>✅ Seus favoritos serão excluídos</li>
            <li>✅ Histórico de adoções será perdido</li>
            <li>❌ Não será possível recuperar a conta</li>
          </ul>
          <p>Tem certeza que deseja continuar?</p>
        </div>

        <div className="modal-actions">
          <button
            className="btn-confirm-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Excluindo..." : "🗑️ Sim, Excluir Minha Conta"}
          </button>

          <button
            className="btn-cancelar"
            onClick={onClose}
            disabled={loading}
          >
            Manter Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}
