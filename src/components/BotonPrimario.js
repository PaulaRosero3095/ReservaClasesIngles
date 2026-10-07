import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../theme';

export default function BotonPrimario({
  texto,
  icono,
  onPress,
  disabled = false,
  colorFondo = colors.primario,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: colorFondo },
        pressed && styles.botonPresionado,
        disabled && styles.botonDeshabilitado,
      ]}
    >
      {icono && (
        <Ionicons name={icono} size={20} color="#FFFFFF" />
      )}
      <Text style={styles.botonTexto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  botonPresionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});