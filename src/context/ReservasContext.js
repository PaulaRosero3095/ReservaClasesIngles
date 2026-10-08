import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useUsuario from '../hooks/useUsuario';

export const ReservasContext = createContext(null);

const claveDe = (identificacion) =>
  `@reservaclases:v1:reservas:${identificacion}`;

export function ReservaProvider({ children }) {
  const { usuario, cargando: cargandoUsuario } = useUsuario();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const identificacion = usuario?.identificacion ?? null;

  // Cargar reservas cada vez que cambia el usuario activo
  useEffect(() => {
    let activo = true;

    // Sin usuario
    if (!identificacion) {
      setReservas([]);
      setCargando(false);
      return () => {
        activo = false;
      };
    }

    setCargando(true);

    (async () => {
      try {
        const guardado = await AsyncStorage.getItem(claveDe(identificacion));
        if (activo) {
          setReservas(guardado ? JSON.parse(guardado) : []);
        }
      } catch (error) {
        console.log('Error leyendo reservas: ', error);
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, [identificacion]);

  // Persistir cada vez que cambien las reservas 
  useEffect(() => {
    if (cargando || !identificacion) return;
    AsyncStorage.setItem(claveDe(identificacion), JSON.stringify(reservas)).catch(
      (error) => console.log('Error al guardar reservas: ', error)
    );
  }, [reservas, cargando, identificacion]);

  // Agregar reserva 
  const agregarReserva = useCallback(
    (clase, horario) => {
      if (!identificacion) {
        return { ok: false, motivo: 'sin-usuario' };
      }

      const id = `${clase.id}-${horario}`;

      // 1. Duplicado exacto 
      if (reservas.some((r) => r.id === id)) {
        return { ok: false, motivo: 'duplicada' };
      }

      // 2. Choque de horario con OTRA clase del mismo usuario
      if (reservas.some((r) => r.horario === horario)) {
        return { ok: false, motivo: 'choque-horario' };
      }

      const nueva = {
        id,
        claseId: clase.id,
        titulo: clase.titulo,
        nivel: clase.nivel,
        profesor: clase.profesor.nombre,
        imagen: clase.imagen,
        precio: clase.precio,
        horario,
        identificacion,
        creadoEn: new Date().toISOString(),
      };

      setReservas((previas) => [nueva, ...previas]);
      return { ok: true };
    },
    [reservas, identificacion]
  );

  // Editar reserva 
  const editarReserva = useCallback(
    (id, nuevoHorario) => {
      // Validar choque con otra reserva
      const choca = reservas.some(
        (r) => r.id !== id && r.horario === nuevoHorario
      );
      if (choca) return { ok: false, motivo: 'choque-horario' };

      setReservas((previas) =>
        previas.map((r) =>
          r.id === id
            ? { ...r, horario: nuevoHorario, id: `${r.claseId}-${nuevoHorario}` }
            : r
        )
      );
      return { ok: true };
    },
    [reservas]
  );

  const eliminarReserva = useCallback((id) => {
    setReservas((previas) => previas.filter((r) => r.id !== id));
  }, []);

  const valor = useMemo(
    () => ({
      reservas,
      cargando: cargando || cargandoUsuario,
      agregarReserva,
      editarReserva,
      eliminarReserva,
    }),
    [reservas, cargando, cargandoUsuario, agregarReserva, editarReserva, eliminarReserva]
  );

  return (
    <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>
  );
}