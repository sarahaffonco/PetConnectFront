import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/adocaoGatos.css";
import gatosNovelo from "../assets/gatosNovelo.png";
import gatosAmigos from "../assets/gatosAmigos.png";
import miau from "../assets/miau.jpg";

const API_URL = 'http://localhost:3000/api/pets'; 
const LIMIT_PER_PAGE = 8; 

export default function AdocaoGatos() {
  const [gatos, setGatos] = useState([]);
  const [filtros, setFiltros] = useState({
    personalidade: [],
    tamanho: "",
    idadeMin: "",
    idadeMax: "",
  });
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    carregarGatos();
  }, [filtros, paginaAtual]);

  const carregarGatos = async () => {
    setLoading(true);
    
    const params = {
      especie: 'gato', 
      page: paginaAtual,
      limit: LIMIT_PER_PAGE,
    };

    if (filtros.personalidade.length > 0) {
      // Envia as personalidades separadas por vírgula
      params.personalidade = filtros.personalidade.join(",");
    }
    if (filtros.tamanho) params.tamanho = filtros.tamanho;
    if (filtros.idadeMin) params.idadeMin = filtros.idadeMin;
    if (filtros.idadeMax) params.idadeMax = filtros.idadeMax;

    try {
      // Fazer a requisição GET
      const response = await axios.get(API_URL, { params });
      // Atualizar os estados com os dados e paginação da API
      const { pets, pagination } = response.data;
      
      // **Ajuste para a foto:** Você precisará garantir que a URL da foto esteja correta no seu banco de dados.
      // Vou simular um campo 'fotoUrl' vindo do backend.
      setGatos(pets);
      setTotalPages(pagination.pages);
      setTotalResults(pagination.total);
    } catch (error) {
      console.error("Erro ao carregar gatos:", error);
      setGatos([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const toggleFiltroPersonalidade = (personalidade) => {
    setPaginaAtual(1); // Resetar para a primeira página ao mudar filtros
    setFiltros((prev) => ({
      ...prev,
      personalidade: prev.personalidade.includes(personalidade)
        ? prev.personalidade.filter((p) => p !== personalidade)
        : [...prev.personalidade, personalidade],
    }));
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPaginaAtual(newPage);
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

          {/* Título à direita */}
          <div className="header-content">
            <h2>Encontre seu novo companheiro</h2>
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
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filtros.personalidade.includes("energetico")}
                  onChange={() => toggleFiltroPersonalidade("energetico")}
                />
                Energético
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filtros.personalidade.includes("amigavel")}
                  onChange={() => toggleFiltroPersonalidade("amigavel")}
                />
                Amigável
              </label>
            </div>
          </aside>

          {/* Cards Grid */}
          <div className="cards-container">
            {loading ? (
              <div className="loading">Carregando...</div>
            ) : totalResults === 0 ? (
              <div className="no-results">
                Nenhum gato encontrado com esses filtros
              </div>
            ) : (
              <div className="cards-grid">
                {gatos.map((gato) => (
                  <div key={gato.id} className="gato-card">
                    <div className="card-image">
                      {/* Lembre-se: o campo 'foto' deve vir da sua API. Substitua 'gato.foto' pelo campo correto */}
                      <img src={gato.fotoUrl || miau} alt={gato.nome} /> 
                      <button className="btn-favorito">♡</button>
                    </div>
                    <div className="card-content">
                      <h3>{gato.nome}</h3>
                      <p>{gato.descricao}</p>
                      <button className="btn-adotar">Ver mais</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn-page"
                  onClick={() => handlePageChange(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                >
                  ←
                </button>
                <span className="page-number active">{paginaAtual} de {totalPages}</span>
                <button 
                  className="btn-page"
                  onClick={() => handlePageChange(paginaAtual + 1)}
                  disabled={paginaAtual === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}