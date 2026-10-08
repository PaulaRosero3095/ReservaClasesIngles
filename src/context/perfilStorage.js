import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave con prefijo y versión para poder migrar el esquema más adelante
const CLAVE_USUARIOS = '@reservaclases:v1:usuarios';

// Devuelve un objeto { [identificacion]: usuario }.
// Si es el primer arranque o el JSON está dañado, devuelve {}.
async function leerUsuarios() {
  try {
    const guardado = await AsyncStorage.getItem(CLAVE_USUARIOS);
    if (guardado === null) return {};
    const datos = JSON.parse(guardado);
    return datos && typeof datos === 'object' ? datos : {};
  } catch (error) {
    console.log('Error leyendo usuarios: ', error);
    return {};
  }
}

// Busca un usuario por su número de identificación. Devuelve null si no existe.
export async function buscarUsuario(identificacion) {
  const usuarios = await leerUsuarios();
  return usuarios[identificacion] ?? null;
}

// Crea o actualiza un usuario. Al usar la identificación como clave,
// nunca se puede duplicar el registro de una misma persona.
export async function guardarUsuario(usuario) {
  const usuarios = await leerUsuarios();
  usuarios[usuario.identificacion] = usuario;
  await AsyncStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}