import '../styles/footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons'; // Importando faPaw

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-splash splash-top-left"></div>
      <div className="footer-splash splash-bottom-right"></div>

      <div className="footer-content">

        <div className="footer-col footer-col-logo">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faPaw} className="logo-icon" />
            <span>Pet Connect</span>
          </div>
          <p className="logo-tagline">Focados em vidas, entregando amor</p>
        </div>

        <div className="footer-col">
          <h3>Nossos voluntários</h3>
          <ul>
            <p>QUERO POR NOSSO LINKEDIN</p>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Endereço</h3>
          <p>8592 Fairground St, Tallahassee, FL 32303</p>
          <p>+775 378-6346</p>
          <p>rgariton@outlook.com</p>
        </div>
        </div>
      <div className="footer-bottom">
        <p>© Copyright Pet Shop. 2024. Design by figma guru</p>
      </div>
    </footer>
  );
}
