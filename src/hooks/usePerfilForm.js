import { useState, useCallback, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { buscarUsuario } from '../context/perfilStorage';
import useUsuario from './useUsuario';

const FORM_VACIO = {
  nombres: '',
  apellidos: '',
  correo: '',
  identificacion: '',
  celular: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_RE = /^\d{5,15}$/;
const CELULAR_RE = /^\d{10}$/;

export default function usePerfilForm() {
  const { usuario, registrar, cerrarSesion } = useUsuario();

  const [form, setForm] = useState(FORM_VACIO);
  const [existente, setExistente] = useState(false);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm(usuario);
      setExistente(true);
      setErrores({});
    } else {
      setForm(FORM_VACIO);
      setExistente(false);
      setErrores({});
    }
  }, [usuario]);

  const setCampo = useCallback((campo, valor) => {
    setForm((previo) => ({ ...previo, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  }, []);

  const cargarExistente = useCallback(
    async (usuarioEncontrado) => {
      setForm(usuarioEncontrado);
      setExistente(true);
      setErrores({});

      try {
        await registrar(usuarioEncontrado);
      } catch (error) {
        console.log('Error marcando usuario activo: ', error);
      }

      Alert.alert(
        'Bienvenido de nuevo',
        `Hola, ${usuarioEncontrado.nombres} ${usuarioEncontrado.apellidos}`.trim()
      );
    },
    [registrar]
  );

  const verificarUsuario = useCallback(async () => {
    const id = form.identificacion.trim();
    if (existente || !ID_RE.test(id)) return;

    try {
      const encontrado = await buscarUsuario(id);
      if (encontrado) {
        await cargarExistente(encontrado);
      }
    } catch (error) {
      console.log('Error verificando usuario: ', error);
    }
  }, [form.identificacion, existente, cargarExistente]);

  const validar = useCallback(() => {
    const nuevos = {};
    if (!form.nombres.trim()) nuevos.nombres = 'Ingresa tus nombres';
    if (!form.apellidos.trim()) nuevos.apellidos = 'Ingresa tus apellidos';
    if (!EMAIL_RE.test(form.correo.trim())) nuevos.correo = 'Correo no válido';
    if (!ID_RE.test(form.identificacion.trim()))
      nuevos.identificacion = 'Entre 5 y 15 dígitos';
    if (!CELULAR_RE.test(form.celular.trim()))
      nuevos.celular = 'Debe tener 10 dígitos';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }, [form]);

  const enviar = useCallback(async () => {
    if (guardando) return;
    setGuardando(true);

    try {
      const id = form.identificacion.trim();

      if (!existente) {
        if (ID_RE.test(id)) {
          const previo = await buscarUsuario(id);
          if (previo) {
            await cargarExistente(previo);
            return;
          }
        }

        if (!validar()) return;

        const nuevo = {
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          correo: form.correo.trim(),
          identificacion: id,
          celular: form.celular.trim(),
        };

        await registrar(nuevo);
        setForm(nuevo);
        setExistente(true);
        Alert.alert('Registro con éxito');
        return;
      }

      if (!validar()) return;

      const guardado = await buscarUsuario(id);
      const actualizado = {
        ...(guardado ?? form),
        correo: form.correo.trim(),
        celular: form.celular.trim(),
      };

      await registrar(actualizado);
      setForm(actualizado);
      Alert.alert('Datos actualizados');
    } catch (error) {
      console.log('Error guardando usuario: ', error);
      Alert.alert('Error', 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  }, [form, existente, guardando, validar, cargarExistente, registrar]);

  const reiniciar = useCallback(async () => {
    setForm(FORM_VACIO);
    setExistente(false);
    setErrores({});
    try {
      await cerrarSesion();
    } catch (error) {
      console.log('Error cerrando sesión: ', error);
    }
  }, [cerrarSesion]);

  const textoBoton = useMemo(
    () =>
      existente ? `${form.nombres} ${form.apellidos}`.trim() : 'Registrarse',
    [existente, form.nombres, form.apellidos]
  );

  return {
    form,
    setCampo,
    errores,
    existente,
    guardando,
    textoBoton,
    verificarUsuario,
    enviar,
    reiniciar,
    usuario,
  };
}