import { useState } from "react";
import AppRouter from "./router/router";
import ModalLogin from "./models/modalLogin";
import ModalCadastroUsuario from "./models/modalCadastroUsuario";
import { useAuth } from "./hooks/useAuth";
import "./styles/app.css";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const { usuario, logout, atualizarUsuario } = useAuth(); 

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

  //  Usa a função do hook useAuth
  const handleUsuarioUpdate = (usuarioAtualizado) => {
    atualizarUsuario(usuarioAtualizado);
  };

  return (
    <>
      <AppRouter
        onLoginClick={abrirLogin}
        usuario={usuario}
        onLogout={logout}
        onUsuarioUpdate={handleUsuarioUpdate}
      />
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
