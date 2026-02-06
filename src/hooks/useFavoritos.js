import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const API_URL = `${import.meta.env.VITE_API_URL}/api/favoritos`;

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const { usuario } = useAuth();

  // Carregar favoritos do usuário
  const carregarFavoritos = useCallback(async () => {
    if (!usuario) {
      setFavoritos([]);
      return;
    }

    try {
      setCarregando(true);
      const response = await axios.get(`${API_URL}/${usuario.id}`);
      setFavoritos(response.data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavoritos([]);
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  // Adicionar favorito
  const adicionarFavorito = async (petId) => {
    if (!usuario) {
      alert('Você precisa estar logado para favoritar pets!');
      return false;
    }

    try {
      const response = await axios.post(API_URL, {
        usuarioId: usuario.id,
        petId: parseInt(petId)
      });

      if (response.status === 201) {
        setFavoritos(prev => [...prev, response.data]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      if (error.response?.data?.erro) {
        alert(error.response.data.erro);
      } else {
        alert('Erro ao favoritar pet. Tente novamente.');
      }
      return false;
    }
  };

  // Remover favorito
  const removerFavorito = async (petId) => {
    if (!usuario) {
      return false;
    }

    try {
      await axios.delete(`${API_URL}/${usuario.id}/${petId}`);
      setFavoritos(prev => prev.filter(fav => fav.petId !== parseInt(petId)));
      return true;
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      if (error.response?.data?.erro) {
        alert(error.response.data.erro);
      } else {
        alert('Erro ao remover favorito. Tente novamente.');
      }
      return false;
    }
  };

  // Alternar favorito
  const alternarFavorito = async (petId) => {
    if (!usuario) {
      alert('Você precisa estar logado para favoritar pets!');
      return false;
    }

    setCarregando(true);
    try {
      const jaEhFavorito = ehFavorito(petId);
      
      if (jaEhFavorito) {
        const sucesso = await removerFavorito(petId);
        return !sucesso;
      } else {
        const sucesso = await adicionarFavorito(petId);
        return sucesso;
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  // Verificar se pet é favorito
  const ehFavorito = (petId) => {
    return favoritos.some(fav => fav.petId === parseInt(petId));
  };

  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  return {
    favoritos,
    carregando,
    alternarFavorito,
    ehFavorito,
    carregarFavoritos
  };
};
