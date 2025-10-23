import { Link } from "react-router-dom";
import "../styles/navBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faMagnifyingGlass,
  faSignOutAlt,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPaw } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ onLoginClick, usuario, onLogout }) {
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <FontAwesomeIcon icon={faPaw} />
          <span>Pet Connect</span>
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Início</Link>
        </li>
        <li>
          <Link to="/adocao/cachorros">Cachorros</Link>
        </li>
        <li>
          <Link to="/adocao/gatos">Gatos</Link>
        </li>
        <li>
          <Link to="/contato">Contato</Link>
        </li>
      </ul>

      {/* Container para os ícones e botão de login */}
      <div className="nav-icons">
        {/* Container da busca com ícone dentro */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="icon-search"
          />
        </div>

        {/* Se usuário estiver logado */}
        {usuario ? (
          <div className="user-menu">
            <div className="user-info">
              <FontAwesomeIcon icon={faUserCircle} className="icon-user-logged" />
              <span className="user-name">Olá, {usuario.nome.split(' ')[0]}</span>
            </div>
            <div className="user-dropdown">
              <Link to="/usuario" className="dropdown-item">
                <FontAwesomeIcon icon={faUser} />
                Meu Perfil
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                <FontAwesomeIcon icon={faSignOutAlt} />
                Sair
              </button>
            </div>
          </div>
        ) : (
          /* Se usuário não estiver logado */
          <>
            {/* Ícone do usuário */}
            <Link to="/usuario" className="user-link" title="Perfil do Usuário">
              <FontAwesomeIcon icon={faUser} className="icon-user" />
            </Link>

            {/* Botão de login */}
            <button className="btn-login-icon" onClick={onLoginClick}>
              <FontAwesomeIcon icon={faSignInAlt} className="icon-login" />
              <span className="login-text">Login</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
