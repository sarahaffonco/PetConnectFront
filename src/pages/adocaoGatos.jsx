import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/adocaoGatos.css";
import gatosNovelo from "../assets/gatosNovelo.png";
import gatosAmigos from "../assets/gatosAmigos.png";
import miau from "../assets/miau.jpg";
import { PET_SPECIES } from "../config/constants";
import { useAuth } from "../hooks/useAuth";
import ModalAdocao from "../models/modalAdocao";
import { useFavoritos } from "../hooks/useFavoritos";

const API_URL = import.meta.env.VITE_API_URL + "/pets";
const LIMIT_PER_PAGE = 8;

export default function AdocaoGatos({ onLoginClick }) {
  const { usuario } = useAuth();
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    personalidade: [],
    tamanho: "",
    idadeMin: "",
    idadeMax: "",
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [erro, setErro] = useState("");
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [modalAdocaoAberto, setModalAdocaoAberto] = useState(false);

  // Estados para o CRUD inline
  const [editandoGatoId, setEditandoGatoId] = useState(null);
  const [campoEditando, setCampoEditando] = useState(null);
  const [formDataGato, setFormDataGato] = useState({
    nome: "",
    descricao: "",
    especie: "",
    raca: "",
    tamanho: "",
    personalidade: "",
    dataNascimento: "",
    status: "disponivel",
  });
  const [carregandoCRUD, setCarregandoCRUD] = useState(false);
  const [mensagemCRUD, setMensagemCRUD] = useState("");

  const {
    favoritos,
    alternarFavorito,
    ehFavorito,
    carregando: carregandoFavoritos,
  } = useFavoritos();

  const carregarGatos = useCallback(async () => {
    setLoading(true);
    setErro("");

    const params = {
      especie: PET_SPECIES.CAT,
      pagina: paginaAtual,
      limite: LIMIT_PER_PAGE,
    };

    if (filtros.personalidade.length > 0) {
      params.personalidade = filtros.personalidade.join(",");
    }
    if (filtros.tamanho) params.tamanho = filtros.tamanho;
    if (filtros.idadeMin) params.idadeMin = filtros.idadeMin;
    if (filtros.idadeMax) params.idadeMax = filtros.idadeMax;

    try {
      console.log("Buscando gatos com params:", params);

      const response = await axios.get(API_URL, { params });
      console.log("Resposta completa da API:", response.data);

      const { pets, paginacao } = response.data;

      if (pets && Array.isArray(pets)) {
        console.log(pets);
        setGatos(pets);

        if (paginacao) {
          setTotalPages(paginacao.paginas || 1);
          setTotalResults(paginacao.total || pets.length);
        } else {
          setTotalPages(1);
          setTotalResults(pets.length);
        }
      } else {
        console.error("Estrutura de resposta inesperada:", response.data);
        setGatos([]);
        setTotalPages(1);
        setTotalResults(0);
        setErro("Erro ao carregar dados dos gatos");
      }
    } catch (error) {
      console.error("Erro ao carregar gatos:", error);
      setErro("Erro ao carregar lista de gatos");
      setGatos([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filtros, paginaAtual]);

  useEffect(() => {
    carregarGatos();
  }, [carregarGatos]);

  // Funções do CRUD inline
  const iniciarEdicaoInline = useCallback((gato, campo) => {
    setEditandoGatoId(gato.id);
    setCampoEditando(campo);
    setFormDataGato((prev) => ({
      ...prev,
      [campo]: gato[campo] || "",
    }));
  }, []);

  const handleFormChangeGato = useCallback((e) => {
    const { name, value } = e.target;
    setFormDataGato((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const salvarEdicaoInline = useCallback(
    async (campo) => {
      if (!editandoGatoId) return;

      try {
        setCarregandoCRUD(true);
        setMensagemCRUD("");

        const dadosAtualizar = { [campo]: formDataGato[campo] };

        await axios.put(`${API_URL}/${editandoGatoId}`, dadosAtualizar);

        setMensagemCRUD("✅ Campo atualizado com sucesso!");
        setEditandoGatoId(null);
        setCampoEditando(null);

        // Recarregar a lista
        carregarGatos();
      } catch (error) {
        console.error("Erro ao atualizar gato:", error);
        setMensagemCRUD(
          "❌ Erro ao atualizar: " +
            (error.response?.data?.erro || error.message)
        );
      } finally {
        setCarregandoCRUD(false);
      }
    },
    [editandoGatoId, formDataGato, carregarGatos]
  );

  const cancelarEdicaoInline = useCallback(() => {
    setEditandoGatoId(null);
    setCampoEditando(null);
    setFormDataGato({
      nome: "",
      descricao: "",
      especie: "",
      raca: "",
      tamanho: "",
      personalidade: "",
      dataNascimento: "",
      status: "disponivel",
    });
    setMensagemCRUD("");
  }, []);

  const handleAdotarClick = (gato) => {
    if (!usuario) {
      alert("Você precisa fazer login para adotar um pet!");
      if (onLoginClick) {
        onLoginClick();
      }
      return;
    }

    if (gato.status === "adotado") {
      alert("Este gatinho já foi adotado! ❤️");
      return;
    }

    setPetSelecionado(gato);
    setModalAdocaoAberto(true);
  };

  const handleAdocaoSucesso = () => {
    carregarGatos();
    setPetSelecionado(null);
  };

  //  Função para favoritos
  const handleFavoritoClick = async (petId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!usuario) {
      alert("Você precisa estar logado para favoritar pets!");
      if (onLoginClick) {
        onLoginClick();
      }
      return;
    }

    await alternarFavorito(petId);
  };

  const toggleFiltroPersonalidade = (personalidade) => {
    setPaginaAtual(1);
    setFiltros((prev) => ({
      ...prev,
      personalidade: prev.personalidade.includes(personalidade)
        ? prev.personalidade.filter((p) => p !== personalidade)
        : [...prev.personalidade, personalidade],
    }));
  };

  const handleFiltroTamanho = (tamanho) => {
    setPaginaAtual(1);
    setFiltros((prev) => ({
      ...prev,
      tamanho: prev.tamanho === tamanho ? "" : tamanho,
    }));
  };

  const handleFiltroIdade = (campo, valor) => {
    setPaginaAtual(1);
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const limparFiltros = () => {
    setPaginaAtual(1);
    setFiltros({
      personalidade: [],
      tamanho: "",
      idadeMin: "",
      idadeMax: "",
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPaginaAtual(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calcularIdade = (dataNascimento) => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    const diffAnos = hoje.getFullYear() - nascimento.getFullYear();
    const diffMeses = hoje.getMonth() - nascimento.getMonth();

    const mesesTotais = diffAnos * 12 + diffMeses;

    if (mesesTotais < 12) {
      return `${mesesTotais} ${mesesTotais === 1 ? "mês" : "meses"}`;
    } else {
      const anos = Math.floor(mesesTotais / 12);
      const meses = mesesTotais % 12;
      if (meses === 0) {
        return `${anos} ${anos === 1 ? "ano" : "anos"}`;
      }
      return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`;
    }
  };

  // Função para formatar data para input type="date"
  const formatarDataParaInput = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toISOString().split("T")[0];
  };

  return (
    <div className="adocao-gatos-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>O seu amigo de patas e bigodes te espera</h1>
          <p>
            Na PetConnect, cada ronronar conta uma história de esperança.
            Encontre o seu amor felino e leve para casa!
          </p>
        </div>
        <div className="hero-image">
          <img src={gatosNovelo} alt="Gatos adoráveis" />
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="main-header">
          <div className="cats-section">
            <div className="cats-image-container">
              <img src={gatosAmigos} alt="Gatinhos" />
            </div>
          </div>

          <div className="header-content">
            <h2>Encontre seu novo companheiro</h2>
            {erro && <div className="erro-mensagem">{erro}</div>}

            {/* Mensagem do CRUD */}
            {mensagemCRUD && (
              <div
                className={`message ${mensagemCRUD.includes("✅") ? "success" : "error"}`}
              >
                {mensagemCRUD}
              </div>
            )}
          </div>
        </div>

        <div className="content-wrapper">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Filtros</h3>
              <p className="resultados-count">
                Mostrando {gatos.length} de {totalResults} resultados
              </p>
              <button className="btn-limpar-filtros" onClick={limparFiltros}>
                Limpar Filtros
              </button>
            </div>

            <div className="filter-section">
              <h4>Personalidade</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filtros.personalidade.includes("brincalhao")}
                  onChange={() => toggleFiltroPersonalidade("brincalhao")}
                />
                Brincalhão
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filtros.personalidade.includes("calmo")}
                  onChange={() => toggleFiltroPersonalidade("calmo")}
                />
                Calmo
              </label>
            </div>

            <div className="filter-section">
              <h4>Tamanho</h4>
              {["pequeno", "medio", "grande"].map((tamanho) => (
                <label key={tamanho} className="checkbox-label">
                  <input
                    type="radio"
                    name="tamanho"
                    checked={filtros.tamanho === tamanho}
                    onChange={() => handleFiltroTamanho(tamanho)}
                  />
                  {tamanho.charAt(0).toUpperCase() + tamanho.slice(1)}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4>Idade</h4>
              <div className="idade-filtros">
                <div className="idade-input">
                  <label>Idade mínima (anos)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={filtros.idadeMin}
                    onChange={(e) =>
                      handleFiltroIdade("idadeMin", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="idade-input">
                  <label>Idade máxima (anos)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={filtros.idadeMax}
                    onChange={(e) =>
                      handleFiltroIdade("idadeMax", e.target.value)
                    }
                    placeholder="30"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Cards Grid */}
          <div className="cards-container">
            {loading ? (
              <div className="loading">Carregando gatinhos... 🐱</div>
            ) : gatos.length === 0 ? (
              <div className="no-results">
                {totalResults === 0
                  ? "Nenhum gato disponível para adoção no momento"
                  : "Nenhum gato encontrado com esses filtros"}
                <button className="btn-limpar-filtros" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="cards-grid">
                  {gatos.map((gato) => (
                    <div key={gato.id} className="gato-card">
                      <div className="card-image">
                        <img src={gato.fotoUrl || miau} alt={gato.nome} />
                        <button
                          className={`btn-favorito ${ehFavorito(gato.id) ? "favoritado" : ""} ${carregandoFavoritos ? "carregando" : ""}`}
                          onClick={(e) => handleFavoritoClick(gato.id, e)}
                          title={
                            ehFavorito(gato.id)
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                          disabled={carregandoFavoritos}
                        >
                          {carregandoFavoritos
                            ? "⏳"
                            : ehFavorito(gato.id)
                              ? "❤️"
                              : "♡"}
                        </button>
                        {gato.status === "adotado" && (
                          <div className="badge-adotado">Adotado ❤️</div>
                        )}
                      </div>
                      <div className="card-content">
                        {/* NOME - Edição Inline */}
                        <div className="pet-field">
                          <strong>Nome:</strong>
                          {editandoGatoId === gato.id &&
                          campoEditando === "nome" ? (
                            <div className="inline-edit">
                              <input
                                type="text"
                                name="nome"
                                value={formDataGato.nome}
                                onChange={handleFormChangeGato}
                                className="inline-input"
                              />
                              <button
                                className="btn-salvar-inline"
                                onClick={() => salvarEdicaoInline("nome")}
                                disabled={carregandoCRUD}
                              >
                                💾
                              </button>
                              <button
                                className="btn-cancelar-inline"
                                onClick={cancelarEdicaoInline}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="inline-view">
                              <span>{gato.nome}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(gato, "nome")
                                }
                                title="Editar nome"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* DESCRIÇÃO - Edição Inline */}
                        <div className="pet-field">
                          <strong>Descrição:</strong>
                          {editandoGatoId === gato.id &&
                          campoEditando === "descricao" ? (
                            <div className="inline-edit">
                              <textarea
                                name="descricao"
                                value={formDataGato.descricao}
                                onChange={handleFormChangeGato}
                                className="inline-textarea"
                                rows="3"
                              />
                              <button
                                className="btn-salvar-inline"
                                onClick={() => salvarEdicaoInline("descricao")}
                                disabled={carregandoCRUD}
                              >
                                💾
                              </button>
                              <button
                                className="btn-cancelar-inline"
                                onClick={cancelarEdicaoInline}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="inline-view">
                              <span>{gato.descricao || "Sem descrição"}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(gato, "descricao")
                                }
                                title="Editar descrição"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* RAÇA - Edição Inline */}
                        <div className="pet-field">
                          <strong>Raça:</strong>
                          {editandoGatoId === gato.id &&
                          campoEditando === "raca" ? (
                            <div className="inline-edit">
                              <input
                                type="text"
                                name="raca"
                                value={formDataGato.raca}
                                onChange={handleFormChangeGato}
                                className="inline-input"
                              />
                              <button
                                className="btn-salvar-inline"
                                onClick={() => salvarEdicaoInline("raca")}
                                disabled={carregandoCRUD}
                              >
                                💾
                              </button>
                              <button
                                className="btn-cancelar-inline"
                                onClick={cancelarEdicaoInline}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="inline-view">
                              <span>{gato.raca || "SRD"}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(gato, "raca")
                                }
                                title="Editar raça"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* TAMANHO - Edição Inline */}
                        <div className="pet-field">
                          <strong>Tamanho:</strong>
                          {editandoGatoId === gato.id &&
                          campoEditando === "tamanho" ? (
                            <div className="inline-edit">
                              <select
                                name="tamanho"
                                value={formDataGato.tamanho}
                                onChange={handleFormChangeGato}
                                className="inline-select"
                              >
                                <option value="pequeno">Pequeno</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                              </select>
                              <button
                                className="btn-salvar-inline"
                                onClick={() => salvarEdicaoInline("tamanho")}
                                disabled={carregandoCRUD}
                              >
                                💾
                              </button>
                              <button
                                className="btn-cancelar-inline"
                                onClick={cancelarEdicaoInline}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="inline-view">
                              <span>
                                {gato.tamanho === "pequeno"
                                  ? "Pequeno"
                                  : gato.tamanho === "medio"
                                    ? "Médio"
                                    : "Grande"}
                              </span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(gato, "tamanho")
                                }
                                title="Editar tamanho"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* PERSONALIDADE - Edição Inline */}
                        <div className="pet-field">
                          <strong>Personalidade:</strong>
                          {editandoGatoId === gato.id &&
                          campoEditando === "personalidade" ? (
                            <div className="inline-edit">
                              <select
                                name="personalidade"
                                value={formDataGato.personalidade}
                                onChange={handleFormChangeGato}
                                className="inline-select"
                              >
                                <option value="brincalhao">Brincalhão</option>
                                <option value="calmo">Calmo</option>
                              </select>
                              <button
                                className="btn-salvar-inline"
                                onClick={() =>
                                  salvarEdicaoInline("personalidade")
                                }
                                disabled={carregandoCRUD}
                              >
                                💾
                              </button>
                              <button
                                className="btn-cancelar-inline"
                                onClick={cancelarEdicaoInline}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="inline-view">
                              <span>
                                {gato.personalidade === "brincalhao"
                                  ? "Brincalhão"
                                  : "Calmo"}
                              </span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(gato, "personalidade")
                                }
                                title="Editar personalidade"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        {/* DATA DE NASCIMENTO - Edição Inline */}
                        <div className="pet-field">
                          <strong>Nascimento:</strong>
                          {editandoGatoId === gato.id &&
                          campoEditando === "dataNascimento" ? (
                            <div className="inline-edit">
                              <input
                                type="date"
                                name="dataNascimento"
                                value={formatarDataParaInput(
                                  formDataGato.dataNascimento
                                )}
                                onChange={handleFormChangeGato}
                                className="inline-input"
                              />
                              <button
                                className="btn-salvar-inline"
                                onClick={() =>
                                  salvarEdicaoInline("dataNascimento")
                                }
                                disabled={carregandoCRUD}
                              >
                                💾
                              </button>
                              <button
                                className="btn-cancelar-inline"
                                onClick={cancelarEdicaoInline}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="inline-view">
                              <span>{calcularIdade(gato.dataNascimento)}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(gato, "dataNascimento")
                                }
                                title="Editar data de nascimento"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="card-actions">
                          <button
                            className={`btn-adotar ${gato.status === "adotado" ? "btn-adotado" : ""}`}
                            onClick={() => handleAdotarClick(gato)}
                            disabled={gato.status === "adotado"}
                          >
                            {gato.status === "adotado"
                              ? "Já foi adotado"
                              : "Adotar 🐾"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className={`btn-page ${paginaAtual === 1 ? "disabled" : ""}`}
                      onClick={() => handlePageChange(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                    >
                      ← Anterior
                    </button>

                    <div className="page-info">
                      Página <span className="current-page">{paginaAtual}</span>{" "}
                      de {totalPages}
                    </div>

                    <button
                      className={`btn-page ${paginaAtual === totalPages ? "disabled" : ""}`}
                      onClick={() => handlePageChange(paginaAtual + 1)}
                      disabled={paginaAtual === totalPages}
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modal de Adoção */}
      <ModalAdocao
        isOpen={modalAdocaoAberto}
        onClose={() => setModalAdocaoAberto(false)}
        pet={petSelecionado}
        onAdocaoSucesso={handleAdocaoSucesso}
        onLoginClick={onLoginClick}
      />
    </div>
  );
}
