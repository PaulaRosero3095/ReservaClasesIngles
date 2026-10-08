import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { buscarUsuario, guardarUsuario } from './perfilStorage';

// Clave donde guardamos SOLO el id del usuario activo
const CLAVE_USUARIO_ACTIVO = '@reservaclases:v1:usuarioActivo';

export const UsuarioContext = createContext(null);

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // objeto completo o null
  const [cargando, setCargando] = useState(true);

  // Al montar, intentamos recuperar el usuario activo
  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        const id = await AsyncStorage.getItem(CLAVE_USUARIO_ACTIVO);
        if (id && activo) {
          const encontrado = await buscarUsuario(id);
          if (activo && encontrado) setUsuario(encontrado);
        }
      } catch (error) {
        console.log('Error cargando usuario activo: ', error);
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  // Registra o actualiza un usuario y lo marca como activo
  const registrar = useCallback(async (datos) => {
    await guardarUsuario(datos);              // 1. Persiste en perfilStorage
    await AsyncStorage.setItem(           // 2. Marca como activo
      CLAVE_USUARIO_ACTIVO,
      datos.identificacion
    );
    setUsuario(datos);                        // 3. Actualiza estado global
  }, []);

  // Cierra sesión: borra el ID activo, pero NO el usuario del disco
  const cerrarSesion = useCallback(async () => {
    await AsyncStorage.removeItem(CLAVE_USUARIO_ACTIVO);
    setUsuario(null);
  }, []);

  // Refresca el usuario activo desde disco (útil si otro proceso lo cambió)
  const refrescar = useCallback(async () => {
    if (!usuario?.identificacion) return;
    const encontrado = await buscarUsuario(usuario.identificacion);
    if (encontrado) setUsuario(encontrado);
  }, [usuario]);

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      estaLogueado: !!usuario,
      registrar,
      cerrarSesion,
      refrescar,
    }),
    [usuario, cargando, registrar, cerrarSesion, refrescar]
  );

  return (
    <UsuarioContext.Provider value={valor}>{children}</UsuarioContext.Provider>
  );
}