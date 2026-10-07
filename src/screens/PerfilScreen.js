import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CampoTexto from '../components/CampoTexto';
import BotonPrimario from '../components/BotonPrimario';   // ⬅️ NUEVO
import { colors, spacing, typography } from '../theme';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [celular, setCelular] = useState('');

  const manejarRegistro = () => {
    // TODO: implementar lógica de registro
    console.log('Registro pendiente de implementar');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.pantalla}
        contentContainerStyle={[
          styles.contenido,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.encabezado}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={36} color={colors.primario} />
          </View>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>
            Completa tus datos para empezar a reservar clases.
          </Text>
        </View>

        <View style={styles.formulario}>
          <CampoTexto
            etiqueta="Nombres"
            icono="person-outline"
            placeholder="Ej: Laura Camila"
            value={nombres}
            onChangeText={setNombres}
          />
          <CampoTexto
            etiqueta="Apellidos"
            icono="person-outline"
            placeholder="Ej: Gómez Pérez"
            value={apellidos}
            onChangeText={setApellidos}
          />
          <CampoTexto
            etiqueta="Correo electrónico"
            icono="mail-outline"
            placeholder="tucorreo@ejemplo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CampoTexto
            etiqueta="No. de identificación"
            icono="card-outline"
            placeholder="Ej: 1023456789"
            value={identificacion}
            onChangeText={setIdentificacion}
            keyboardType="numeric"
            maxLength={15}
          />
          <CampoTexto
            etiqueta="Celular"
            icono="call-outline"
            placeholder="Ej: 3001234567"
            value={celular}
            onChangeText={setCelular}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        
        <BotonPrimario
          texto="Registrarse"
          icono="checkmark-circle-outline"
          onPress={manejarRegistro}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  contenido: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  encabezado: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  titulo: {
    ...typography.titulo,
    fontSize: 22,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textoSuave,
    textAlign: 'center',
    lineHeight: 18,
  },
  formulario: {
    gap: spacing.md,
  },
});