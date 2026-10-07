import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../theme';

export default function CampoTexto({
  etiqueta,
  icono,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
  editable = true,
  onEndEditing,
  error,
}) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>

      <View
        style={[
          styles.inputWrapper,
          !editable && styles.bloqueado,
          !!error && styles.conError,
        ]}
      >
        {icono && (
          <Ionicons
            name={icono}
            size={18}
            color={colors.textoSuave}
            style={styles.icono}
          />
        )}

        <TextInput
          style={[styles.input, !editable && styles.inputBloqueado]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textoSuave}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          editable={editable}
          onEndEditing={onEndEditing}
        />
      </View>

      {!!error && <Text style={styles.textoError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: spacing.xs,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.texto,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borde,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  // campo de solo lectura (usuario ya registrado)
  bloqueado: {
    backgroundColor: colors.fondo,
  },
  // campo con error de validación
  conError: {
    borderColor: colors.peligro,
  },
  icono: {
    // pequeño ajuste óptico para centrar con el texto
    marginTop: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.texto,
    paddingVertical: 0,
  },
  inputBloqueado: {
    color: colors.textoSuave,
  },
  textoError: {
    fontSize: 12,
    color: colors.peligro,
  },
});