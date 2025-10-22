import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/adocaoCaes.css";
import dogBanner from "../assets/dogBanner.png";
import dogFriends from "../assets/dogFriends.png";
import dogDefault from "../assets/dogDefault.png";

const API_URL = "http://localhost:3000/api/pets";
const LIMIT_PER_PAGE = 8;

export default function AdocaoCaes() {
  const [caes, setCaes] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregarCaes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          especie: "cachorro",
          page: paginaAtual,
          limit: LIMIT_PER_PAGE,
        },
      });

      const { pets, pagination } = response.data;
      setCaes(pets);
      setTotalPages(pagination.pages);
      setTotalResults(pagination.total);
    } catch (error) {
      console.error("Erro ao carregar cães:", error);
      setCaes([]);
    } finally {
      setLoading(false);
    }
  }, [paginaAtual]);

  useEffect(() => {
    carregarCaes();
  }, [carregarCaes]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPaginaAtual(newPage);
    }
  };

  return (
    <div className="adocao-caes-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Cãezinhos</span>
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
          </div>
        </div>

        <div className="cards-grid">
          {loading ? (
            <p>Carregando...</p>
          ) : totalResults === 0 ? (
            <p>Nenhum cachorro encontrado no momento.</p>
          ) : (
            caes.map((cao) => (
              <div key={cao.id} className="pet-card">
                <div className="card-image">
                  <img src={cao.fotoUrl || dogDefault} alt={cao.nome} />
                  <button className="btn-favorito">♡</button>
                </div>
                <div className="card-content">
                  <h3>{cao.nome}</h3>
                  <p>{cao.descricao}</p>
                  <button className="btn-adotar">Ver mais</button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn-page"
              onClick={() => handlePageChange(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              ←
            </button>
            <span className="page-number">
              {paginaAtual} de {totalPages}
            </span>
            <button
              className="btn-page"
              onClick={() => handlePageChange(paginaAtual + 1)}
              disabled={paginaAtual === totalPages}
            >
              →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
