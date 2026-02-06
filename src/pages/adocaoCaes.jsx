import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/adocaoCaes.css";
import dogBanner from "../assets/dogBanner.png";
import dogFriends from "../assets/dogFriends.png";
import dogDefault from "../assets/dogDefault.png";
import { useFavoritos } from "../hooks/useFavoritos";
import { useAuth } from "../hooks/useAuth";
import ModalAdocao from "../models/modalAdocao";

const API_URL = `${import.meta.env.VITE_API_URL}/api/pets`;
const LIMITE_POR_PAGINA = 8;

export default function AdocaoCaes({ onLoginClick }) {
  const [caes, setCaes] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [caoSelecionado, setCaoSelecionado] = useState(null);
  const [modalAdocaoAberto, setModalAdocaoAberto] = useState(false);

  // Estados para o CRUD inline
  const [editandoCaoId, setEditandoCaoId] = useState(null);
  const [campoEditando, setCampoEditando] = useState(null);
  const [formDataCao, setFormDataCao] = useState({
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

  // Estado dos filtros
  const [filtros, setFiltros] = useState({
    personalidade: [],
    tamanho: "",
    idadeMin: "",
    idadeMax: "",
  });

  // eslint-disable-next-line no-unused-vars
  const {
    favoritos,
    alternarFavorito,
    ehFavorito,
    carregando: carregandoFavoritos,
  } = useFavoritos();
  const { usuario } = useAuth();

  const carregarCaes = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const params = {
        especie: "Cachorro",
        pagina: paginaAtual,
        limite: LIMITE_POR_PAGINA,
      };

      // Aplicar filtros
      if (filtros.personalidade.length > 0) {
        params.personalidade = filtros.personalidade.join(",");
      }
      if (filtros.tamanho) params.tamanho = filtros.tamanho;
      if (filtros.idadeMin) params.idadeMin = filtros.idadeMin;
      if (filtros.idadeMax) params.idadeMax = filtros.idadeMax;

      console.log("Buscando cães com params:", params);

      const response = await axios.get(API_URL, { params });
      console.log("Resposta completa da API:", response.data);

      const { pets, paginacao } = response.data;

      if (pets && Array.isArray(pets)) {
        setCaes(pets);

        if (paginacao) {
          setTotalPaginas(paginacao.paginas || 1);
          setTotalResultados(paginacao.total || pets.length);
        } else {
          setTotalPaginas(1);
          setTotalResultados(pets.length);
        }
      } else {
        console.error("Estrutura de resposta inesperada:", response.data);
        setCaes([]);
        setTotalPaginas(1);
        setTotalResultados(0);
        setErro("Erro ao carregar dados dos cães");
      }
    } catch (error) {
      console.error("Erro ao carregar cães:", error);
      setErro("Erro ao carregar lista de cães");
      setCaes([]);
      setTotalPaginas(1);
      setTotalResultados(0);
    } finally {
      setCarregando(false);
    }
  }, [paginaAtual, filtros]);

  useEffect(() => {
    carregarCaes();
  }, [carregarCaes]);

  // Funções do CRUD inline
  const iniciarEdicaoInline = useCallback((cao, campo) => {
    setEditandoCaoId(cao.id);
    setCampoEditando(campo);
    setFormDataCao((prev) => ({
      ...prev,
      [campo]: cao[campo] || "",
    }));
  }, []);

  const handleFormChangeCao = useCallback((e) => {
    const { name, value } = e.target;
    setFormDataCao((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const salvarEdicaoInline = useCallback(
    async (campo) => {
      if (!editandoCaoId) return;

      try {
        setCarregandoCRUD(true);
        setMensagemCRUD("");

        const dadosAtualizar = { [campo]: formDataCao[campo] };

        await axios.put(`${API_URL}/${editandoCaoId}`, dadosAtualizar);

        setMensagemCRUD("✅ Campo atualizado com sucesso!");
        setEditandoCaoId(null);
        setCampoEditando(null);

        // Recarregar a lista
        carregarCaes();
      } catch (error) {
        console.error("Erro ao atualizar cão:", error);
        setMensagemCRUD(
          "❌ Erro ao atualizar: " +
            (error.response?.data?.erro || error.message)
        );
      } finally {
        setCarregandoCRUD(false);
      }
    },
    [editandoCaoId, formDataCao, carregarCaes]
  );

  const cancelarEdicaoInline = useCallback(() => {
    setEditandoCaoId(null);
    setCampoEditando(null);
    setFormDataCao({
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

  const handleAdotarClick = (cao) => {
    if (!usuario) {
      alert("Você precisa fazer login para adotar um cão!");
      if (onLoginClick) {
        onLoginClick();
      }
      return;
    }

    if (cao.status === "adotado") {
      alert("Este cãozinho já foi adotado! ❤️");
      return;
    }

    setCaoSelecionado(cao);
    setModalAdocaoAberto(true);
  };

  const handleAdocaoSucesso = () => {
    carregarCaes();
    setCaoSelecionado(null);
  };

  //  Função handleFavoritoClick completa com verificação de login
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

  // Funções de filtro
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

  const handleMudancaPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Calcular idade aproximada do cão
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
    <div className="adocao-caes-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Adote um amigo leal e cheio de amor</h1>
          <p>
            Na PetConnect, cada rabo abanando é uma nova chance de felicidade.
            Dê um lar a um cãozinho e receba amor incondicional!
          </p>
        </div>
        <div className="hero-image">
          <img src={dogBanner} alt="Cachorros felizes" />
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="main-content">
        <div className="main-header">
          <div className="dogs-section">
            <div className="dogs-image-container">
              <img src={dogFriends} alt="Cãezinhos" />
            </div>
          </div>

          <div className="header-content">
            <h2>Encontre seu novo companheiro de quatro patas</h2>

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
          {/* Sidebar Filters  */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Filtros</h3>
              <p className="resultados-count">
                Mostrando {caes.length} de {totalResultados} resultados
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
            {carregando ? (
              <div className="loading">Carregando cãezinhos... 🐶</div>
            ) : caes.length === 0 ? (
              <div className="no-results">
                {totalResultados === 0
                  ? "Nenhum cachorro disponível para adoção no momento"
                  : "Nenhum cachorro encontrado com esses filtros"}
                <button className="btn-limpar-filtros" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="cards-grid">
                  {caes.map((cao) => (
                    <div key={cao.id} className="pet-card">
                      <div className="card-image">
                        <img src={cao.fotoUrl || dogDefault} alt={cao.nome} />
                        {/* Botão de favorito */}
                        <button
                          className={`btn-favorito ${ehFavorito(cao.id) ? "favoritado" : ""} ${carregandoFavoritos ? "carregando" : ""}`}
                          onClick={(e) => handleFavoritoClick(cao.id, e)}
                          title={
                            ehFavorito(cao.id)
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                          disabled={carregandoFavoritos}
                        >
                          {carregandoFavoritos
                            ? "⏳"
                            : ehFavorito(cao.id)
                              ? "❤️"
                              : "♡"}
                        </button>
                        {cao.status === "adotado" && (
                          <div className="badge-adotado">Adotado ❤️</div>
                        )}
                      </div>
                      <div className="card-content">
                        {/* NOME - Edição Inline */}
                        <div className="pet-field">
                          <strong>Nome:</strong>
                          {editandoCaoId === cao.id &&
                          campoEditando === "nome" ? (
                            <div className="inline-edit">
                              <input
                                type="text"
                                name="nome"
                                value={formDataCao.nome}
                                onChange={handleFormChangeCao}
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
                              <span>{cao.nome}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() => iniciarEdicaoInline(cao, "nome")}
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
                          {editandoCaoId === cao.id &&
                          campoEditando === "descricao" ? (
                            <div className="inline-edit">
                              <textarea
                                name="descricao"
                                value={formDataCao.descricao}
                                onChange={handleFormChangeCao}
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
                              <span>{cao.descricao || "Sem descrição"}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(cao, "descricao")
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
                          {editandoCaoId === cao.id &&
                          campoEditando === "raca" ? (
                            <div className="inline-edit">
                              <input
                                type="text"
                                name="raca"
                                value={formDataCao.raca}
                                onChange={handleFormChangeCao}
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
                              <span>{cao.raca || "SRD"}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() => iniciarEdicaoInline(cao, "raca")}
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
                          {editandoCaoId === cao.id &&
                          campoEditando === "tamanho" ? (
                            <div className="inline-edit">
                              <select
                                name="tamanho"
                                value={formDataCao.tamanho}
                                onChange={handleFormChangeCao}
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
                                {cao.tamanho === "pequeno"
                                  ? "Pequeno"
                                  : cao.tamanho === "medio"
                                    ? "Médio"
                                    : "Grande"}
                              </span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(cao, "tamanho")
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
                          {editandoCaoId === cao.id &&
                          campoEditando === "personalidade" ? (
                            <div className="inline-edit">
                              <select
                                name="personalidade"
                                value={formDataCao.personalidade}
                                onChange={handleFormChangeCao}
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
                                {cao.personalidade === "brincalhao"
                                  ? "Brincalhão"
                                  : "Calmo"}
                              </span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(cao, "personalidade")
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
                          {editandoCaoId === cao.id &&
                          campoEditando === "dataNascimento" ? (
                            <div className="inline-edit">
                              <input
                                type="date"
                                name="dataNascimento"
                                value={formatarDataParaInput(
                                  formDataCao.dataNascimento
                                )}
                                onChange={handleFormChangeCao}
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
                              <span>{calcularIdade(cao.dataNascimento)}</span>
                              <button
                                className="btn-editar-inline"
                                onClick={() =>
                                  iniciarEdicaoInline(cao, "dataNascimento")
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
                            className={`btn-adotar ${cao.status === "adotado" ? "btn-adotado" : ""}`}
                            onClick={() => handleAdotarClick(cao)}
                            disabled={cao.status === "adotado"}
                          >
                            {cao.status === "adotado"
                              ? "Já foi adotado"
                              : "Adotar 🐾"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPaginas > 1 && (
                  <div className="paginacao">
                    <button
                      className={`btn-pagina ${paginaAtual === 1 ? "disabled" : ""}`}
                      onClick={() => handleMudancaPagina(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                    >
                      ← Anterior
                    </button>

                    <div className="info-pagina">
                      Página <span className="pagina-atual">{paginaAtual}</span>{" "}
                      de {totalPaginas}
                    </div>

                    <button
                      className={`btn-pagina ${paginaAtual === totalPaginas ? "disabled" : ""}`}
                      onClick={() => handleMudancaPagina(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
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
        pet={caoSelecionado}
        onAdocaoSucesso={handleAdocaoSucesso}
        onLoginClick={onLoginClick}
      />
    </div>
  );
}
