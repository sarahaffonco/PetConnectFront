import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/adocaoCaes.css";
import dogBanner from "../assets/dogBanner.png";
import dogFriends from "../assets/dogFriends.png";
import dogDefault from "../assets/dogDefault.png";
import { useFavoritos } from "../hooks/useFavoritos";

const API_URL = "http://localhost:3000/api/pets";
const LIMITE_POR_PAGINA = 8;

export default function AdocaoCaes() {
  const [caes, setCaes] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  const { favoritos, alternarFavorito, ehFavorito } = useFavoritos();

  const carregarCaes = useCallback(async () => {
    setCarregando(true);
    try {
      let petsData = [];

      if (mostrarFavoritos) {
        // Mostrar apenas favoritos
        petsData = favoritos.filter(pet => pet.especie === "Cachorro");
        setCaes(petsData);
        setTotalPaginas(1);
        setTotalResultados(petsData.length);
      } else {
        // Carregar todos os cães
        const response = await axios.get(API_URL, {
          params: {
            especie: "Cachorro",
            pagina: paginaAtual,
            limite: LIMITE_POR_PAGINA,
          },
        });

        const { pets, paginacao } = response.data;
        petsData = pets;
        setCaes(pets);
        setTotalPaginas(paginacao.paginas);
        setTotalResultados(paginacao.total);
      }
    } catch (error) {
      console.error("Erro ao carregar cães:", error);
      setCaes([]);
    } finally {
      setCarregando(false);
    }
  }, [paginaAtual, mostrarFavoritos, favoritos]);

  useEffect(() => {
    carregarCaes();
  }, [carregarCaes]);

  const handleFavoritoClick = async (petId, e) => {
    e.preventDefault();
    e.stopPropagation();

    await alternarFavorito(petId);
    // Se estiver na view de favoritos, recarrega a lista
    if (mostrarFavoritos) {
      carregarCaes();
    }
  };

  const handleAdotarClick = (petId) => {
    alert(`Processo de adoção iniciado para o pet ${petId}`);
    console.log("Iniciar adoção do pet:", petId);
  };

  const handleEditarClick = (petId) => {
    alert(`Editar pet ${petId}`);
    console.log("Editar pet:", petId);
  };

  const handleMudancaPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const toggleFiltroFavoritos = () => {
    setMostrarFavoritos(!mostrarFavoritos);
    setPaginaAtual(1);
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

            {/* Filtro de Favoritos */}
            <div className="filtro-favoritos">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={mostrarFavoritos}
                  onChange={toggleFiltroFavoritos}
                />
                Mostrar apenas favoritos
              </label>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          {carregando ? (
            <p>Carregando cães...</p>
          ) : totalResultados === 0 ? (
            <p>
              {mostrarFavoritos
                ? "Nenhum cachorro favoritado no momento."
                : "Nenhum cachorro encontrado no momento."
              }
            </p>
          ) : (
            caes.map((cao) => (
              <div key={cao.id} className="pet-card">
                <div className="card-image">
                  <img src={cao.fotoUrl || dogDefault} alt={cao.nome} />
                  <button
                    className={`btn-favorito ${ehFavorito(cao.id) ? 'favoritado' : ''}`}
                    onClick={(e) => handleFavoritoClick(cao.id, e)}
                    title={ehFavorito(cao.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    {ehFavorito(cao.id) ? '❤️' : '♡'}
                  </button>
                </div>
                <div className="card-content">
                  <h3>{cao.nome}</h3>
                  <p>{cao.descricao || "Um lindo cachorro à procura de um lar!"}</p>
                  <div className="pet-info">
                    <span>📅 {new Date(cao.dataNascimento).toLocaleDateString()}</span>
                    <span>⚡ {cao.personalidade === 'brincalhao' ? 'Brincalhão' : 'Calmo'}</span>
                    <span>📏 {cao.tamanho === 'pequeno' ? 'Pequeno' : cao.tamanho === 'medio' ? 'Médio' : 'Grande'}</span>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-adotar"
                      onClick={() => handleAdotarClick(cao.id)}
                    >
                      🐾 Adotar
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => handleEditarClick(cao.id)}
                    >
                      ✏️ Editar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!mostrarFavoritos && totalPaginas > 1 && (
          <div className="paginacao">
            <button
              className="btn-pagina"
              onClick={() => handleMudancaPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              ←
            </button>
            <span className="numero-pagina">
              {paginaAtual} de {totalPaginas}
            </span>
            <button
              className="btn-pagina"
              onClick={() => handleMudancaPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
