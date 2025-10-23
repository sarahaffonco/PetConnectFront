import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (error) {
        console.error('Erro ao parsear usuário do localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }

    setCarregando(false);
  }, []);

  const login = (token, usuarioData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    setUsuario(usuarioData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.reload();
  };

  //  Atualizar dados do usuário
  const atualizarUsuario = (usuarioAtualizado) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    setUsuario(usuarioAtualizado);
  };

  const estaLogado = () => {
    return !!usuario;
  };

  return {
    usuario,
    carregando,
    login,
    logout,
    atualizarUsuario, 
    estaLogado
  };
};
