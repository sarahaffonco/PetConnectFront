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

const API_URL = "http://localhost:3000/api/pets";
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


  // eslint-disable-next-line no-unused-vars
  const { favoritos, alternarFavorito, ehFavorito, carregando: carregandoFavoritos } = useFavoritos();

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

  return (
    <div className="adocao-gatos-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Gatinhos</span>
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
                          {carregandoFavoritos ? "⏳" : (ehFavorito(gato.id) ? "❤️" : "♡")}
                        </button>
                        {gato.status === "adotado" && (
                          <div className="badge-adotado">Adotado ❤️</div>
                        )}
                      </div>
                      <div className="card-content">
                        <h3>{gato.nome}</h3>
                        <p>
                          {gato.descricao ||
                            "Um lindo gatinho à procura de um lar!"}
                        </p>
                        <div className="pet-info">
                          <span>🐱 {calcularIdade(gato.dataNascimento)}</span>
                          <span>📏 {gato.tamanho || "Não informado"}</span>
                          <span>
                            ⚡{" "}
                            {gato.personalidade === "brincalhao"
                              ? "Brincalhão"
                              : "Calmo"}
                          </span>
                        </div>
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
