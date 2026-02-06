import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/navBar";
import Footer from "../components/footer";
import Home from "../pages/home";
import AdocaoGatos from "../pages/adocaoGatos";
import Usuario from "../pages/usuario";
import Contato from "../pages/contato";
import AdocaoCaes from "../pages/adocaoCaes";

export default function AppRouter({ onLoginClick, usuario, onLogout, onUsuarioUpdate }) {
  return (
    <Router>
      <Navbar
        onLoginClick={onLoginClick}
        usuario={usuario}
        onLogout={onLogout}
      />
      <Routes>
        <Route path="/" element={<Home usuario={usuario} />} />
        <Route path="/adocao/cachorros" element={<AdocaoCaes />} />
        <Route path="/adocao/gatos" element={<AdocaoGatos />} />
        <Route
          path="/usuario"
          element={
            <Usuario
              usuario={usuario}
              onLogout={onLogout}
              onUsuarioUpdate={onUsuarioUpdate} 
            />
          }
        />
        <Route path="/contato" element={<Contato />} />
      </Routes>
      <Footer />
    </Router>
  );
}
