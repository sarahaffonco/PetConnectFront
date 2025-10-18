import '../styles/home.css'
import dogHero from '../assets/pets.png'
import catIcon from '../assets/cats.png'
import dogIcon from '../assets/dogs.png'

export default function Home() {
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
          <button className="btn-adotar">Adote</button>
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
            <h3>Felinos</h3>
          </div>
          <div className="card card-dog-splash ">
            <img src={dogIcon} alt="Cachorro" />
            <h3>Caninos</h3>
          </div>
        </div>
      </section>


    </div>
  );
}
