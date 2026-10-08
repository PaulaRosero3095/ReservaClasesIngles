import { useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';

export default function useUsuario() {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario debe usarse dentro de <UsuarioProvider>');
  }
  return context;
}