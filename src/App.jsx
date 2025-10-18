import { useState } from "react";
import AppRouter from "./router/router";
import ModalLogin from "./modal/modalLogin";
import ModalCadastroUsuario from "./modal/modalCadastroUsuario";
import "./styles/app.css";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

  const abrirLogin = () => {
    setIsLoginOpen(true);
    setIsCadastroOpen(false);
  };

  const abrirCadastro = () => {
    setIsCadastroOpen(true);
    setIsLoginOpen(false);
  };

  const fecharModais = () => {
    setIsLoginOpen(false);
    setIsCadastroOpen(false);
  };

  return (
    <>
      <AppRouter onLoginClick={abrirLogin} />
      <ModalLogin
        isOpen={isLoginOpen}
        onClose={fecharModais}
        onCadastrarClick={abrirCadastro}
      />
      <ModalCadastroUsuario
        isOpen={isCadastroOpen}
        onClose={fecharModais}
      />
    </>
  );
}

export default App;
