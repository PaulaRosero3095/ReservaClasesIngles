import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { buscarUsuario, guardarUsuario } from '../services/perfilStorage';

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
  const [form, setForm] = useState(FORM_VACIO);
  const [existente, setExistente] = useState(false); // true = usuario ya registrado
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const setCampo = useCallback((campo, valor) => {
    setForm((previo) => ({ ...previo, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  }, []);

  // Autocompleta el formulario y bloquea los campos que no se pueden editar
  const cargarExistente = useCallback((usuario) => {
    setForm(usuario);
    setExistente(true);
    setErrores({});
    Alert.alert('Usuario registrado');
  }, []);

  // Se llama al salir del campo de identificación (onEndEditing)
  const verificarUsuario = useCallback(async () => {
    const id = form.identificacion.trim();
    if (existente || !ID_RE.test(id)) return;

    try {
      const usuario = await buscarUsuario(id);
      if (usuario) cargarExistente(usuario);
    } catch (error) {
      console.log('Error verificando usuario: ', error);
    }
  }, [form.identificacion, existente, cargarExistente]);

  const validar = useCallback(() => {
    const nuevos = {};
    if (!form.nombres.trim()) nuevos.nombres = 'Ingresa tus nombres';
    if (!form.apellidos.trim()) nuevos.apellidos = 'Ingresa tus apellidos';
    if (!EMAIL_RE.test(form.correo.trim())) nuevos.correo = 'Correo no válido';
    if (!ID_RE.test(form.identificacion.trim())) nuevos.identificacion = 'Entre 5 y 15 dígitos';
    if (!CELULAR_RE.test(form.celular.trim())) nuevos.celular = 'Debe tener 10 dígitos';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }, [form]);

  const enviar = useCallback(async () => {
    if (guardando) return;
    setGuardando(true);

    try {
      const id = form.identificacion.trim();

      if (!existente) {
        // Puede que la persona ya exista y no haya salido del campo de identificación
        if (ID_RE.test(id)) {
          const previo = await buscarUsuario(id);
          if (previo) {
            cargarExistente(previo); // no se duplica: solo trae los datos
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
        await guardarUsuario(nuevo);
        setForm(nuevo);
        setExistente(true);
        Alert.alert('Registro con éxito');
        return;
      }

      // Usuario ya registrado: solo se actualizan correo y celular
      if (!validar()) return;

      const guardado = await buscarUsuario(id);
      const actualizado = {
        ...(guardado ?? form),
        correo: form.correo.trim(),
        celular: form.celular.trim(),
      };
      await guardarUsuario(actualizado);
      setForm(actualizado);
      Alert.alert('Datos actualizados');
    } catch (error) {
      console.log('Error guardando usuario: ', error);
      Alert.alert('Error', 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  }, [form, existente, guardando, validar, cargarExistente]);

  // Salida de emergencia: si se cargó un usuario por error, se puede volver a empezar
  const reiniciar = useCallback(() => {
    setForm(FORM_VACIO);
    setExistente(false);
    setErrores({});
  }, []);

  const textoBoton = useMemo(
    () => (existente ? `${form.nombres} ${form.apellidos}`.trim() : 'Registrarse'),
    [existente, form.nombres, form.apellidos]
  );

  return {form, setCampo, errores, existente, guardando, textoBoton, verificarUsuario, enviar, reiniciar,
  };
}