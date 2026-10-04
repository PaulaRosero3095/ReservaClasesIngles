import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius } from '../theme';

export default function BotonReservar({ onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.boton,
        pressed && styles.botonPresionado,
        disabled && styles.botonDeshabilitado,
      ]}
    >
      <Ionicons
        name="calendar-outline"
        size={20}
        color="#FFFFFF"
      />

      <Text style={styles.botonTexto}>
        {disabled ? 'Sin cupos' : 'Reservar clase'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primario,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },

  botonPresionado: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  botonDeshabilitado: {
    opacity: 0.5,
  },

  botonTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});