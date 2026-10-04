import { Platform } from 'react-native';

// Paleta central del proyecto para mantener la misma identidad visual en toda la app.
export const colors = {
  fondo: '#F6F7FB',
  superficie: '#FFFFFF',
  primario: '#4F46E5',
  primarioOscuro: '#3730A3',
  primarioSuave: '#EEF0FF',
  acento: '#F59E0B',
  acentoSuave: '#FEF3C7',
  exito: '#0E9F6E',
  peligro: '#E11D48',
  texto: '#111827',
  textoSuave: '#6B7280',
  borde: '#E5E7EB',
};

// Escala de espaciado reutilizable para mantener consistencia en márgenes y paddings.
export const spacing = {
  xs: 2,
  sm: 2,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Radio de bordes común para tarjetas, inputs y elementos redondeados.
export const radius = {
  sm: 16,
  md: 18,
  lg: 50,
  full: 9999,
};

// Tipografías base usadas en la interfaz para mantener un estilo uniforme.
export const typography = {
  titulo: { fontSize: 24, fontWeight: '700', color: colors.texto },
  subtitulo: { fontSize: 18, fontWeight: '700', color: colors.texto },
  cuerpo: { fontSize: 16, color: colors.texto },
  secundario: { fontSize: 14, color: colors.textoSuave },
  etiqueta: { fontSize: 12, fontWeight: '600' },
};

// Sombras adaptadas según la plataforma para mejorar la profundidad visual.
export const sombra = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
});

// Colores asociados a cada nivel del curso de inglés.
export const coloresPorNivel = {
  Basico: colors.exito,
  Intermedio: colors.primario,
  Avanzado: colors.acento,
  Conversacional: '#070609',
};

export default { colors, spacing, radius, typography, sombra, coloresPorNivel };