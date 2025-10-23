import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:3000/api/favoritos';

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
      const response = await axios.get(`${API_URL}/usuario/${usuario.id}`);
      setFavoritos(response.data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavoritos([]);
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  // Alternar favorito
  const alternarFavorito = async (petId) => {
    if (!usuario) {
      alert('Você precisa estar logado para favoritar pets!');
      return false;
    }

    setCarregando(true);
    try {
      const response = await axios.post(`${API_URL}/alternar`, {
        petId: parseInt(petId),
        usuarioId: usuario.id
      });

      if (response.data.favoritado) {
        setFavoritos(prev => [...prev, { id: petId }]);
      } else {
        setFavoritos(prev => prev.filter(pet => pet.id !== petId));
      }

      return response.data.favoritado;
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      alert('Erro ao favoritar pet. Tente novamente.');
      return false;
    } finally {
      setCarregando(false);
    }
  };

  // Verificar se pet é favorito
  const ehFavorito = (petId) => {
    return favoritos.some(pet => pet.id === petId);
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
