import "../styles/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebookF,
  faTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-splash splash-top-left"></div>
      <div className="footer-splash splash-bottom-right"></div>

      <div className="footer-content">
        {/* COLUNA 1: Logo e Redes Sociais */}
        <div className="footer-col footer-col-logo">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faPaw} className="logo-icon" />
            <span>Pet Connect</span>
          </div>
          <p className="logo-tagline">Focados em vidas, entregando amor</p>

          {/* Ícones de Redes Sociais adicionados para corresponder à imagem */}
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="social-icon">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>

        {/* COLUNA 2: Nossos voluntários */}
        <div className="footer-col">
          <h3>Nossos voluntários</h3>
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/anandardrigues">Ananda Rodrigues</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/arianewelke">Ariane Welke</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/devluiis?trk=contact-info ">Luis Paulo</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/pvrezende?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ">Paulo Rezende</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/sarah-jorge-affonco/">Sarah Affonço</a>
            </li>
          </ul>
        </div>

        {/* COLUNA 3: Endereço */}
        <div className="footer-col">
          <h2> Atlântico Avanti</h2>
          <h3>Endereço</h3>
          <p>Ceará</p>
          <p>bootcamp@atlantico.com.br</p>
          <p>(85) 99115-1117</p>
        </div>
      </div>
      {/* LINHA DE COPYRIGHT */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">© 2025 Realização Squad #09.</div>
      </div>
    </footer>
  );
}
