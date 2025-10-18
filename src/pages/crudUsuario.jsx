// src/pages/UsuarioPage.jsx
import { useState, useEffect } from "react";
import "../styles/usuario.css";

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Simula fetch inicial — futuramente substituir por chamada à API (Ex: GET /api/adotantes)
  useEffect(() => {
    const mock = [
      { id: 1, nome: "Maria Silva", email: "maria@email.com", telefone: "99999-9999", endereco: "Rua das Flores, 12" },
      { id: 2, nome: "João Souza", email: "joao@email.com", telefone: "98888-8888", endereco: "Av. Central, 45" },
    ];
    setUsuarios(mock);
  }, []);

  // Criar ou atualizar usuário
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
      );
      setEditingId(null);
    } else {
      const newUser = { id: Date.now(), ...formData };
      setUsuarios([...usuarios, newUser]);
    }

    setFormData({ nome: "", email: "", telefone: "", endereco: "" });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleDelete = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="usuario-page">
      <h2 className="usuario-title">👤 Gerenciamento de Usuários</h2>

      {/* FORMULÁRIO */}
      <form className="usuario-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-roxo">
          {editingId ? "Atualizar Usuário" : "Cadastrar Usuário"}
        </button>
      </form>

      {/* LISTAGEM */}
      <h3 className="usuario-subtitle">Lista de Adotantes</h3>
      <table className="usuario-tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.telefone}</td>
              <td>{u.endereco}</td>
              <td>
                <button className="btn-editar" onClick={() => handleEdit(u)}>Editar</button>
                <button className="btn-excluir" onClick={() => handleDelete(u.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
