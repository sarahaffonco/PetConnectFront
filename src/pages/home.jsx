import "../styles/home.css";
import dogHero from "../assets/pets.png";
import catIcon from "../assets/cats.png";
import dogIcon from "../assets/dogs.png";
import { useState } from "react";
import ModalCadastroPet from "../models/modalCadastroPet.jsx";
import { Link } from "react-router-dom";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero">
        <div className="splash splash-blue-top"></div>
        <div className="splash splash-multi-color-right"></div>
        <div className="splash splash-blue-bottom"></div>
        <div className="hero-text">
          <h1>Connect Pet</h1>
          <p>Conectamos animais e pessoas em um só clique</p>
          {/* Botão para abrir a modal */}
          <button onClick={() => setIsModalOpen(true)} className="blue-btn">
            Cadastrar Pet
          </button>
          {/* Modal */}
          <ModalCadastroPet
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />{" "}
        </div>
        <div className="hero-img">
          <img src={dogHero} alt="Cachorro" />
        </div>
      </section>

      {/* ENCONTRE SEU COMPANHEIRO */}
      <section className="companheiro">
        <h2>Encontre seu novo companheiro</h2>
        <div className="companheiro-cards">
          <div className="card card-cat-splash">
            <img src={catIcon} alt="Gato" />
            <h3><Link to="/adocao/gatos">Felinos</Link></h3>
          </div>
          <div className="card card-dog-splash ">
            <img src={dogIcon} alt="Cachorro" />
            <h3><Link to="/adocao/cachorros">Caninos</Link></h3>
          </div>
        </div>
      </section>
    </div>
  );
}
