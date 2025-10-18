import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/navBar";
import Footer from "../components/footer";
import Home from "../pages/home";
import AdocaoGatos from "../pages/adocaoGatos";
import CrudUsuario from "../pages/crudUsuario";
import Contato from "../pages/contato";
import AdocaoCaes from "../pages/adocaoCaes";


export default function AppRouter({ onLoginClick }) {
  return (
    <Router>
      <Navbar onLoginClick={onLoginClick} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adocao/cachorros" element={<AdocaoCaes />} />
        <Route path="/adocao/gatos" element={<AdocaoGatos />} />
        <Route path="/usuario" element={<CrudUsuario />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
      <Footer />
    </Router>
  );
}
