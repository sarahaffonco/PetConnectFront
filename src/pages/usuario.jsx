/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from "react";
import "../styles/usuario.css";
import axios from "axios";
import ModalDeleteUsuario from "../models/modalDeleteUsuario";

export default function Usuario({ usuario, onLogout, onUsuarioUpdate }) {
  const [usuarios, setUsuarios] = useState([]);
  const [adocoes, setAdocoes] = useState([]);
  const [loadingAdocoes, setLoadingAdocoes] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [inlineEditField, setInlineEditField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);
  const API_URL = "https://petconnect-h8cb.onrender.com/api/adotantes";
  const API_ADOCAO_URL = "https://petconnect-h8cb.onrender.com/api/adocoes";

  //  Limpeza ao desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  //  Carregar lista (modo admin)
  useEffect(() => {
    if (!usuario) {
      fetchUsuarios();
    }
  }, [usuario]);

  //  Carregar adoções do usuário logado
  useEffect(() => {
    if (usuario && usuario.id) {
      fetchAdocoesUsuario();
    }
  }, [usuario]);

  //  Buscar adoções do usuário
  const fetchAdocoesUsuario = useCallback(async () => {
    if (!usuario?.id) return;

    try {
      setLoadingAdocoes(true);
      const response = await axios.get(API_ADOCAO_URL);
      const todasAdocoes = response.data.adocoes || [];

      // Filtrar adoções do usuário logado
      const adocoesUsuario = todasAdocoes.filter(
        (adocao) => adocao.adotanteId === usuario.id
      );

      if (isMountedRef.current) setAdocoes(adocoesUsuario);
    } catch (error) {
      console.error("Erro ao carregar adoções:", error);
      if (isMountedRef.current) {
        setAdocoes([]);
        setMessage("⚠️ Não foi possível carregar suas adoções");
      }
    } finally {
      if (isMountedRef.current) setLoadingAdocoes(false);
    }
  }, [usuario]);

  //  Buscar lista de usuários
  const fetchUsuarios = useCallback(async () => {
    if (isLoadingRef.current) return;
    try {
      isLoadingRef.current = true;
      setLoading(true);
      const response = await axios.get(API_URL);
      const usuariosData = response.data.adotantes || [];
      if (isMountedRef.current) setUsuarios(usuariosData);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      if (isMountedRef.current) {
        setUsuarios([]);
        setMessage("⚠️ Não foi possível carregar a lista de usuários");
      }
    } finally {
      isLoadingRef.current = false;
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  //  Cancelar adoção
  const handleCancelarAdocao = useCallback(
    async (adocaoId) => {
      if (!window.confirm("Tem certeza que deseja cancelar esta adoção?"))
        return;

      try {
        setLoading(true);
        await axios.delete(`${API_ADOCAO_URL}/${adocaoId}`);
        if (isMountedRef.current) {
          setMessage("✅ Adoção cancelada com sucesso!");
          fetchAdocoesUsuario(); // Recarregar a lista
        }
      } catch (error) {
        console.error("Erro ao cancelar adoção:", error);
        if (isMountedRef.current) {
          setMessage(
            "❌ Erro ao cancelar adoção: " +
              (error.response?.data?.erro || error.message)
          );
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [fetchAdocoesUsuario]
  );

  //  Manipular formulário
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  //  Submeter formulário
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setMessage("");

      try {
        if (editingId) {
          await axios.put(`${API_URL}/${editingId}`, formData);
          if (isMountedRef.current) {
            setMessage("✅ Usuário atualizado com sucesso!");
            if (usuario && editingId === usuario.id) {
              const usuarioAtualizado = { ...usuario, ...formData };
              localStorage.setItem(
                "usuario",
                JSON.stringify(usuarioAtualizado)
              );
              setShowEditModal(false);
              setEditingId(null);
            } else {
              setShowEditModal(false);
              setEditingId(null);
              fetchUsuarios();
            }
          }
        } else {
          await axios.post(API_URL, formData);
          if (isMountedRef.current) {
            setMessage("✅ Usuário criado com sucesso!");
            setFormData({ nome: "", email: "", telefone: "", endereco: "" });
            fetchUsuarios();
          }
        }
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        if (isMountedRef.current) {
          setMessage(
            "❌ Erro ao salvar usuário: " +
              (error.response?.data?.error || error.message)
          );
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [loading, editingId, formData, usuario, fetchUsuarios]
  );

  //  Editar usuário (Admin)
  const handleEdit = useCallback((user) => {
    setEditingId(user.id);
    setFormData({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      endereco: user.endereco || "",
    });
    setShowEditModal(true);
  }, []);

  //  Excluir usuário (Admin)
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Tem certeza que deseja excluir este usuário?"))
        return;

      try {
        setLoading(true);
        await axios.delete(`${API_URL}/${id}`);
        if (isMountedRef.current) {
          setMessage("✅ Usuário excluído com sucesso!");
          fetchUsuarios();
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        if (isMountedRef.current) {
          setMessage(
            "❌ Erro ao excluir usuário: " +
              (error.response?.data?.error || error.message)
          );
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [fetchUsuarios]
  );

  //  Excluir conta do usuário logado
  const handleDeleteMyAccount = useCallback(async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${usuario.id}`);
      setMessage("✅ Sua conta foi excluída com sucesso!");
      setTimeout(() => {
        onLogout();
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      if (isMountedRef.current) {
        setMessage(
          "❌ Erro ao excluir conta: " +
            (error.response?.data?.error || error.message)
        );
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [usuario?.id, onLogout]);

  //  Edição inline
  const startInlineEdit = useCallback(
    (campo) => {
      setInlineEditField(campo);
      setFormData((prev) => ({ ...prev, [campo]: usuario[campo] || "" }));
    },
    [usuario]
  );

  const handleInlineSave = useCallback(
    async (campo) => {
      try {
        setLoading(true);
        await axios.put(`${API_URL}/${usuario.id}`, {
          [campo]: formData[campo],
        });
        if (isMountedRef.current) {
          setMessage("✅ Campo atualizado com sucesso!");
          setInlineEditField(null);

          // Atualiza o localStorage
          const usuarioAtualizado = { ...usuario, [campo]: formData[campo] };
          localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

          if (onUsuarioUpdate) {
            onUsuarioUpdate(usuarioAtualizado);
          }
        }
      } catch (error) {
        console.error("Erro ao salvar campo:", error);
        if (isMountedRef.current) {
          setMessage(
            "❌ Erro ao atualizar campo: " +
              (error.response?.data?.error || error.message)
          );
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [usuario, formData, onUsuarioUpdate]
  );

  //  Fechar modal
  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingId(null);
    setInlineEditField(null);
    setFormData({ nome: "", email: "", telefone: "", endereco: "" });
    setMessage("");
  }, []);

  //  Formatar data
  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString("pt-BR");
  };

  //  PERFIL DO USUÁRIO LOGADO
  if (usuario && usuario.id) {
    return (
      <div className="usuario-page">
        <h2 className="usuario-title">👤 Meu Perfil</h2>

        {message && (
          <div
            className={`message ${message.includes("✅") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-info">
            {["nome", "email", "telefone", "endereco"].map((campo) => (
              <div className="info-item" key={campo}>
                <strong>
                  {campo.charAt(0).toUpperCase() + campo.slice(1)}:
                </strong>{" "}
                {inlineEditField === campo ? (
                  <>
                    <input
                      type="text"
                      name={campo}
                      value={formData[campo]}
                      onChange={handleFormChange}
                    />
                    <button
                      className="btn-salvar-inline"
                      onClick={() => handleInlineSave(campo)}
                      disabled={loading}
                    >
                      💾
                    </button>
                    <button
                      className="btn-cancelar-inline"
                      onClick={() => setInlineEditField(null)}
                    >
                      ❌
                    </button>
                  </>
                ) : (
                  <>
                    {usuario[campo] || "Não informado"}
                    <button
                      className="btn-editar-inline"
                      onClick={() => startInlineEdit(campo)}
                    >
                      ✏️ Editar
                    </button>
                  </>
                )}
              </div>
            ))}
            <div className="info-item">
              <strong>Membro desde:</strong>{" "}
              {new Date(
                usuario.criadoEm || usuario.createdAt
              ).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Seção de Adoções do Usuário */}
        <div className="adocoes-section">
          <h3>🐾 Minhas Adoções</h3>

          {loadingAdocoes ? (
            <p className="loading">Carregando suas adoções...</p>
          ) : adocoes.length === 0 ? (
            <p className="no-adocoes">
              Você ainda não realizou nenhuma adoção.
            </p>
          ) : (
            <div className="adocoes-table-container">
              <table className="adocoes-tabela">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Espécie</th>
                    <th>Raça</th>
                    <th>Idade</th>
                    <th>Data da Adoção</th>
                    <th>Observações</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {adocoes.map((adocao) => (
                    <tr key={adocao.id}>
                      <td>{adocao.pet?.nome || "N/A"}</td>
                      <td>{adocao.pet?.especie || "N/A"}</td>
                      <td>{adocao.pet?.raca || "Sem raça definida"}</td>
                      <td>{adocao.pet?.idade || "N/A"}</td>
                      <td>{formatarData(adocao.dataAdocao)}</td>
                      <td>{adocao.observacoes || "Nenhuma"}</td>
                      <td>
                        <button
                          className="btn-cancelar-adocao"
                          onClick={() => handleCancelarAdocao(adocao.id)}
                          disabled={loading}
                          title="Cancelar Adoção"
                        >
                          ❌ Cancelar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <h3>Minhas Ações</h3>
          <div className="action-buttons">
            <button
              className="btn-excluir-conta"
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
            >
              {loading ? "Processando..." : "🗑️ Excluir Minha Conta"}
            </button>
          </div>
        </div>

        {showDeleteModal && (
          <ModalDeleteUsuario
            isOpen={showDeleteModal}
            onClose={handleCloseModal}
            onConfirm={handleDeleteMyAccount}
            loading={loading}
          />
        )}
      </div>
    );
  }

  //  MODO ADMIN (CRUD)
  return (
    <div className="usuario-page">
      <h2 className="usuario-title">👤 Gerenciamento de Usuários</h2>

      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
        </div>
      )}

      <form className="usuario-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleFormChange}
          />
        </div>

        <button type="submit" className="btn-roxo" disabled={loading}>
          {loading
            ? "Salvando..."
            : editingId
              ? "Atualizar Usuário"
              : "Cadastrar Usuário"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => {
              setEditingId(null);
              setFormData({ nome: "", email: "", telefone: "", endereco: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <h3 className="usuario-subtitle">Lista de Adotantes</h3>

      {loading ? (
        <p className="loading">Carregando usuários...</p>
      ) : usuarios.length === 0 ? (
        <p className="no-users">Nenhum usuário cadastrado.</p>
      ) : (
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
                <td>{u.endereco || "-"}</td>
                <td>
                  <button className="btn-editar" onClick={() => handleEdit(u)}>
                    Editar
                  </button>
                  <button
                    className="btn-excluir"
                    onClick={() => handleDelete(u.id)}
                    disabled={loading}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showEditModal && !usuario && (
        <ModalCrudUsuario
          isOpen={showEditModal}
          onClose={handleCloseModal}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          loading={loading}
          message={message}
          isEditingSelf={false}
        />
      )}
    </div>
  );
}
