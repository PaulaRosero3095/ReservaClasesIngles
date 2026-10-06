import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../theme';

export default function MisReservasScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top + spacing.xl }]}>
      <Ionicons name="calendar-outline" size={64} color={colors.primarioSuave} />
      <Text style={styles.titulo}>Mis Reservas</Text>
      <Text style={styles.mensaje}>
        Aún no tienes reservas.{'\n'}¡Explora las clases y reserva tu primera!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  titulo: {
    ...typography.titulo,
    fontSize: 22,
  },
  mensaje: {
    fontSize: 14,
    color: colors.textoSuave,
    textAlign: 'center',
    lineHeight: 20,
  },
});